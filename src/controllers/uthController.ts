// Импортируем типы Request и Response.
// Они нужны только для TypeScript.
import type { Request, Response } from "express";

// bcrypt нужен для сравнения пароля пользователя
// с захешированным паролем в базе данных.
import bcrypt from "bcrypt";

// jsonwebtoken нужен для создания JWT токена.
import jwt from "jsonwebtoken";

// Импортируем prisma client для работы с БД.
import { prisma } from "../prisma.js";

// Создаём класс контроллера авторизации.
class AuthController {
  // ==========================================
  // Генерация JWT токена
  // ==========================================

  generateToken = (user: { id: number }) => {
    // Получаем секретный ключ из .env
    const key = process.env.TOKEN_ACCESS_KEY;

    // Получаем время жизни токена из .env
    const expiresIn = process.env.TOKEN_ACCESS_EXPIRATION_SECS;

    // Проверяем, что переменные существуют.
    if (!key || !expiresIn) {
      throw new Error("Missing token environment variables");
    }

    // Вычисляем время истечения токена.
    // Date.now() возвращает миллисекунды.
    // JWT ожидает секунды.
    const exp = Math.floor(Date.now() / 1000) + Number(expiresIn);

    // Создаём JWT токен.
    return jwt.sign(
      {
        exp,

        // Данные, которые будут храниться внутри токена.
        data: {
          id: user.id,
        },
      },

      // Секретный ключ для подписи токена.
      key
    );
  };

  // ==========================================
  // POST /api/login
  // Авторизация пользователя
  // ==========================================

  login = async (req: Request, res: Response) => {
    try {
      // Получаем email и пароль из body запроса.
      const { email, password } = req.body;

      // Проверяем, что поля заполнены.
      if (!email || !password) {
        return res.status(400).json({
          message: "Email and password are required",
        });
      }

      // Ищем пользователя по email.
      const user = await prisma.user.findFirst({
        where: {
          email,

          // Пользователь должен быть активным.
          isActive: true,
        },

        // Выбираем только нужные поля.
        select: {
          id: true,
          firstname: true,
          lastname: true,
          email: true,
          password: true,
          role: true,
        },
      });

      // Если пользователь не найден.
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Сравниваем введённый пароль
      // с хешем пароля в базе.
      const isPasswordCorrect = await bcrypt.compare(
        password,
        user.password
      );

      // Если пароль неверный.
      if (!isPasswordCorrect) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      // Генерируем JWT токен.
      const accessToken = this.generateToken(user);

      // Возвращаем токен и информацию о пользователе.
      return res.status(200).json({
        accessToken,

        user: {
          id: user.id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          role: user.role,
        },
      });
    } catch (error) {
      // Логируем ошибку в терминал.
      console.error("Error in AuthController login:", error);

      // Возвращаем серверную ошибку.
      return res.status(500).json({
        message: "Something went wrong while logging in",
      });
    }
  };
}

// Создаём экземпляр класса.
export const authController = new AuthController();