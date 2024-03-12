import asyncio
import logging
from aiogram import Bot, Dispatcher, types
from aiogram.filters.command import Command
from aiogram.types import (
    InlineKeyboardButton,
    InlineKeyboardMarkup,
    WebAppInfo,
)

logging.basicConfig(level=logging.INFO)

bot = Bot(token="6852140472:AAHmUMPc-3JBMnsK_kqBXmNWB044Y5JTUrA")


dp = Dispatcher()


@dp.message(Command("start"))
async def cmd_start(message: types.Message):
    await message.answer(
        f"Привет, {message.from_user.first_name}",
        reply_markup=InlineKeyboardMarkup(
            inline_keyboard=[
                [
                    InlineKeyboardButton(
                        text="Нажимать в это место", web_app=WebAppInfo(
                            url="https://17neverends.github.io/test_single/")
                    )
                ]
            ]
        ),
    )


async def main():
    await bot.delete_webhook()
    await dp.start_polling(bot)


if __name__ == "__main__":
    asyncio.run(main())