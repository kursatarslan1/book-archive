const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

class Log{
    static async createLog(log_message, log_screen, log_file, has_error){
        try{
            const newLog = await prisma.LOG.create({
                data: {
                    log_message: log_message,
                    log_screen: log_screen,
                    log_file: log_file,
                    has_error: has_error
                },
            });
        } catch (error){
            console.log("Log couldn't logged.");
            return false;
        }
    }
}

module.exports = { Log };