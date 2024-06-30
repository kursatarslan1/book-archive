const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const { Log } = require("./log_model");

class Friendship{ // user_id1 = sender, user_id2 = receiver
    static async RequestFriend(user_id1, user_id2){
        try{
            const newFriendship = await prisma.FRIENDSHIPS.create({
                data: {
                    user_id1: user_id1,
                    user_id2: user_id2,
                    is_active: 'W',
                },
            });
            await Log.createLog(`Friend request sent from user_id ${user_id1} to user_id ${user_id2}`, "Friendship", "friendship_model.js", "N");
            return newFriendship;
        } catch (error){
            console.log("Error creating request: ", error);
            await Log.createLog(`Error creating friend request from user_id ${user_id1} to user_id ${user_id2}, error: ${error.message}`, "Friendship", "friendship_model.js", "Y");
            return false;
        }
    }

    static async GetFriendRequests(user_id){
        try{
            const requests = await prisma.FRIENDSHIPS.findMany({
                where: {
                    user_id2: user_id,
                },
            });
            await Log.createLog(`Retrieved friend requests for user_id ${user_id}`, "Friendship", "friendship_model.js", "N");
            return requests;
        } catch (error){
            console.log("Error getting friend requests: ", error);
            await Log.createLog(`Error getting friend requests for user_id ${user_id}, error: ${error.message}`, "Friendship", "friendship_model.js", "Y");
            return false;
        }
    }

    static async Approve(relation_id){
        try{
            const approve = await prisma.FRIENDSHIPS.update({
                where: {
                    friendship_id: relation_id,
                },
                data: {
                    is_active: 'Y',
                },
            });
            await Log.createLog(`Friendship approved, relation_id: ${relation_id}`, "Friendship", "friendship_model.js", "N");
            return approve;
        } catch (error){
            console.log("Error approving friend: ", error);
            await Log.createLog(`Error approving friend, relation_id: ${relation_id}, error: ${error.message}`, "Friendship", "friendship_model.js", "Y");
            return false;
        }
    }

    static async Reject(relation_id){
        try{
            const reject = await prisma.FRIENDSHIPS.delete({
                where:{
                    friendship_id: relation_id,
                },
            });
            await Log.createLog(`Friendship rejected, relation_id: ${relation_id}`, "Friendship", "friendship_model.js", "N");
            return reject;
        } catch (error){
            console.log("Error rejecting user: ", error);
            await Log.createLog(`Error rejecting user, relation_id: ${relation_id}, error: ${error.message}`, "Friendship", "friendship_model.js", "Y");
            return false;
        }
    }

    static async GetFriendUserIdList(user_id){
        try{
            const friendList = await prisma.FRIENDSHIPS.findMany({
                where: {
                    OR: [
                        {
                            user_id1: user_id,
                            is_active: 'Y',
                        },
                        {
                            user_id2: user_id,
                            is_active: 'Y',
                        },
                    ],
                },
                select: {
                    user_id1: true,
                    user_id2: true,
                },
            });
    
            const allUserIds = friendList.flatMap(friend => [friend.user_id1, friend.user_id2]);
            const uniqueUserIds = [...new Set(allUserIds)];
    
            return uniqueUserIds;
        } catch(error){
            console.log("Error getting user id list: ", error);
            await Log.createLog(`Error getting user id list for user_id ${user_id}, error: ${error.message}`, "Friendship", "friendship_model.js", "Y");
            return false;
        }
    }
    
}

module.exports = { Friendship };