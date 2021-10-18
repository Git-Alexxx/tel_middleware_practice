const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN)

// use - промежуточный обработчик(middlware)
/*
 перед тем как отдаеться апдейт мидлваром telegraf навешивает на
 на него много полезных методов и свойств облегчая обработку и 
 взаимодействие с юзером(ctx - обьект класса Context(контекс нашего апдейта))

bot.use((ctx) => {

    const {message, edited_message} = ctx.update

    if(message) {
        return ctx.telegram.sendMessage(message.from.id, 'It\s a message!')
    } else if(edited_message) {
        return ctx.telegram.sendMessage(edited_message.from.id, edited_message.text)
    }
})
*/

/*on - обвертка над методом use(удобно когда апдейты отличаются
 по каким-то признакам)*/

bot.use(Telegraf.optional(

    async (ctx) => {
        const random = Math.random()

        await ctx.reply(`Inside predicate: generated number is ${random}`)

        return random > 0.5
    },

    async (ctx, next) => {//мидлвар по умолчанию не вызывает следующий мидлваре по этому исп. мет. next()
        await ctx.reply(`Update id: ${ctx.update.update_id}`)
        return next()
    }

))

bot.on('message', (ctx) => ctx.reply('It\s a message'))
bot.on('edited_message', (ctx) => ctx.reply(ctx.editedMessage.text))

bot.launch()

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))

// https://api.telegram.org/bot2088392080:AAEbuQfQP5gYTLYLKuTTyuBxr-ANxcIWsEI/setWebHook?url=https://hqs4pgovhg.execute-api.us-east-2.amazonaws.com/v0