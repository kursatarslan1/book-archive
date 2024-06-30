const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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
            return newFriendship;
        } catch (error){
            console.log("Error creating request: ", error);
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
            return requests;
        } catch (error){
            console.log("Error getting friend requests: ", error);
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
            return approve;
        } catch (error){
            console.log("Error approving friend: ", error);
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
            return reject;
        } catch (error){
            console.log("Error rejecting user: ", error);
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
    
            // Birleştirilmiş kullanıcı kimliklerini topla
            const allUserIds = friendList.flatMap(friend => [friend.user_id1, friend.user_id2]);
    
            // Tekrar eden kullanıcı kimliklerini kaldır (unique yap)
            const uniqueUserIds = [...new Set(allUserIds)];
    
            return uniqueUserIds;
        } catch(error){
            console.log("Error getting user id list: ", error);
            return false;
        }
    }
    
}

module.exports = { Friendship };