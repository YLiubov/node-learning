// Импортируем только типы Request и Response из Express.
// import type нужен только для TypeScript.
// В runtime этот импорт не превращается в настоящий JS-код.
import type { Request, Response } from "express";

// Импортируем bcrypt.
// Он нужен, чтобы хешировать пароль перед сохранением в базу.
import bcrypt from "bcrypt";

// Импортируем prisma client.
// Через prisma мы общаемся с базой данных.
import { prisma } from "../prisma.js";

// Создаём class controller.
// Controller хранит методы, которые отвечают за логику users.
class UserController {
  // ==========================================
  // GET /users
  // Получить всех пользователей
  // ==========================================

  getRecords = async (req: Request, res: Response) => {
    try {
      // Ищем всех пользователей в таблице users.
      // findMany = найти много записей.
      const data = await prisma.user.findMany({
        // select говорит, какие поля вернуть.
        // password специально НЕ возвращаем.
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      // Возвращаем успешный ответ со статусом 200.
      // json(data) отправляет данные в формате JSON.
      return res.status(200).json(data);
    } catch (error) {
      // Если что-то сломалось, выводим настоящую ошибку в terminal.
      console.error("Error in UserController getRecords:", error);

      // Клиенту/Postman возвращаем аккуратное сообщение.
      return res.status(500).json({
        message: "Something went wrong while fetching users",
      });
    }
  };

  // ==========================================
  // GET /users/:id
  // Получить одного пользователя по id
  // ==========================================

  getRecord = async (req: Request, res: Response) => {
    try {
      // req.params.id приходит из URL.
      // Например /users/1 даст req.params.id = "1".
      // Number() превращает строку "1" в число 1.
      const id = Number(req.params.id);

      // Ищем одного пользователя по уникальному id.
      const data = await prisma.user.findUnique({
        where: { id },

        // Снова выбираем только безопасные поля.
        // password не отдаём.
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      // Если пользователь не найден, data будет null.
      if (!data) {
        return res.status(404).json({
          message: `No user found with id ${id}`,
        });
      }

      // Если нашли, возвращаем пользователя.
      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in UserController getRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while fetching user",
      });
    }
  };

  // ==========================================
  // POST /users
  // Создать нового пользователя
  // ==========================================

  createRecord = async (req: Request, res: Response) => {
    try {
      // Достаём данные из body.
      // Эти значения приходят из Postman form-data/x-www-form-urlencoded.
      const { firstname, lastname, email, password, role, isActive } = req.body;

      // Хешируем пароль.
      // Мы НЕ сохраняем обычный пароль в базу.
      // 10 = salt rounds, уровень сложности хеширования.
      const hashedPassword = await bcrypt.hash(password, 10);

      // Создаём пользователя в базе.
      const data = await prisma.user.create({
        data: {
          firstname,
          lastname,
          email,

          // В базу сохраняется не password, а hashedPassword.
          password: hashedPassword,

          // role должен быть USER или ADMIN.
          role,

          // isActive из Postman приходит строкой "true" или "false".
          // JSON.parse превращает "true" в true.
          isActive: JSON.parse(isActive),
        },

        // Возвращаем безопасные поля.
        // password не возвращаем.
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      // 201 = Created.
      // То есть пользователь успешно создан.
      return res.status(201).json(data);
    } catch (error) {
      console.error("Error in UserController createRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while creating user",
      });
    }
  };

  // ==========================================
  // PUT /users/:id
  // Обновить пользователя по id
  // Можно обновлять только те поля, которые пришли в body
  // ==========================================

  updateRecord = async (req: Request, res: Response) => {
    try {
      // Берём id из URL.
      const id = Number(req.params.id);

      // Берём данные из body.
      const { firstname, lastname, email, password, role, isActive } = req.body;

      // Создаём пустой объект для данных, которые реально нужно обновить.
      const updateData: {
        firstname?: string;
        lastname?: string;
        email?: string;
        password?: string;
        role?: "USER" | "ADMIN";
        isActive?: boolean;
      } = {};

      // Если firstname пришёл, добавляем его в updateData.
      if (firstname !== undefined) {
        updateData.firstname = firstname;
      }

      // Если lastname пришёл, добавляем его в updateData.
      if (lastname !== undefined) {
        updateData.lastname = lastname;
      }

      // Если email пришёл, добавляем его в updateData.
      if (email !== undefined) {
        updateData.email = email;
      }

      // Если role пришёл, добавляем его в updateData.
      if (role !== undefined) {
        updateData.role = role;
      }

      // Если isActive пришёл, превращаем строку "true"/"false" в boolean.
      if (isActive !== undefined) {
        updateData.isActive = JSON.parse(isActive);
      }

      // Если password пришёл, только тогда хешируем и обновляем password.
      if (password !== undefined && password !== "") {
        updateData.password = await bcrypt.hash(password, 10);
      }

      // Обновляем пользователя в базе.
      const data = await prisma.user.update({
        where: { id },
        data: updateData,

        // Возвращаем безопасные поля.
        // Password не возвращаем.
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          role: true,
          isActive: true,
        },
      });

      return res.status(200).json(data);
    } catch (error) {
      console.error("Error in UserController updateRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while updating user",
      });
    }
  };

  // ==========================================
  // DELETE /users/:id
  // Удалить пользователя по id
  // ==========================================

  deleteRecord = async (req: Request, res: Response) => {
    try {
      // Берём id из URL и превращаем в number.
      const id = Number(req.params.id);

      // Удаляем пользователя из базы.
      await prisma.user.delete({
        where: { id },
      });

      // Возвращаем сообщение.
      return res.status(200).json({
        message: `User nr. ${id} is deleted`,
      });
    } catch (error) {
      console.error("Error in UserController deleteRecord:", error);

      return res.status(500).json({
        message: "Something went wrong while deleting user",
      });
    }
  };
}

// Создаём один экземпляр controller.
// Потом импортируем userController в userRoutes.ts.
export const userController = new UserController();
