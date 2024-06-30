const { Friendship } = require("../models/friendship_model");
const jwt = require('jsonwebtoken');
const checkTokenValidity = require("../helpers/check_token_validity");
const { Log } = require('../models/log_model');

async function SendRequest(req, res){
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    const { user_id1, user_id2 } = req.body;

    if(user_id != user_id1){ // açıkla
        return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
        const requestResult = await Friendship.RequestFriend(user_id1, user_id2);
        if(!requestResult){
            await Log.createLog(`An error occured sending friend request from user_id: ${user_id1} to user_id: ${user_id2}`, "Friendship", "friendship_controller.js", "Y");
            return res.status(400).json({ message: "An error occured sending friend request. "});
        }

        await Log.createLog(`Friend request sent successfully from user_id: ${user_id1} to user_id: ${user_id2}`, "Friendship", "friendship_controller.js", "N");
        return res.json({ message: "Friend request sent successfully. "});
    } catch (error){
        console.log("An error occured sending friend request: ", error);
        await Log.createLog(`An error occured sending friend request, error: ${error.message}`, "Friendship", "friendship_controller.js", "Y");
    }
}

async function GetRequests(req, res){
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const receiver_user_id  = parseInt(req.params.receiver_user_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if(user_id != receiver_user_id){
        return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
        const requestResult = await Friendship.GetFriendRequests(receiver_user_id);
        if(!requestResult){
            await Log.createLog(`An error occured getting friend requests for user_id: ${receiver_user_id}`, "Friendship", "friendship_controller.js", "Y");
            return res.status(400).json({ message: "An error occured getting friend requests." });
        }

        await Log.createLog(`Friend requests fetched successfully for user_id: ${receiver_user_id}`, "Friendship", "friendship_controller.js", "N");
        return res.json({ requestResult });
    } catch (error){
        console.log("An error occured getting friend requests: ", error);
        await Log.createLog(`An error occured getting friend requests, error: ${error.message}`, "Friendship", "friendship_controller.js", "Y");
    }
}

async function ApproveRequest(req, res){
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const receiver_user_id = parseInt(req.params.receiver_user_id, 10);
    const relation_id = parseInt(req.params.relation_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if(receiver_user_id != user_id){
        return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
        const approveResult = await Friendship.Approve(relation_id);
        if(!approveResult){
            await Log.createLog(`An error occured approving friend request with relation_id: ${relation_id}`, "Friendship", "friendship_controller.js", "Y");
            return res.status(400).json({ message: "An error occured approving request." });
        }

        await Log.createLog(`Friend request approved successfully with relation_id: ${relation_id}`, "Friendship", "friendship_controller.js", "N");
        return res.json({ message: "Request accepted. "});
    } catch (error){
        console.log("An error occured accepting request: ", error);
        await Log.createLog(`An error occured accepting friend request, error: ${error.message}`, "Friendship", "friendship_controller.js", "Y");
    }
}

async function RejectRequest(req, res){
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const receiver_user_id = parseInt(req.params.receiver_user_id, 10);
    const relation_id = parseInt(req.params.relation_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if(receiver_user_id != user_id){
        return res.status(401).json({ message: "Unauthorized token." });
    }

    try{
        const approveResult = await Friendship.Reject(relation_id);
        if(!approveResult){
            await Log.createLog(`An error occured rejecting friend request with relation_id: ${relation_id}`, "Friendship", "friendship_controller.js", "Y");
            return res.status(400).json({ message: "An error occured rejecting request." });
        }

        await Log.createLog(`Friend request rejected successfully with relation_id: ${relation_id}`, "Friendship", "friendship_controller.js", "N");
        return res.json({ message: "Request rejected. "});
    } catch (error){
        console.log("An error occured rejecting request: ", error);
        await Log.createLog(`An error occured rejecting friend request, error: ${error.message}`, "Friendship", "friendship_controller.js", "Y");
    }
}

async function GetFriendList(req, res){
    const token = req.headers.authorization && req.headers.authorization.split(" ")[1];

    if (!token) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const tokenValid = await checkTokenValidity(token);
    if (!tokenValid) {
        return res.status(400).json({ message: "Invalid token." });
    }

    const current_user_id = parseInt(req.params.current_user_id, 10);

    let user_id;
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        user_id = decodedToken.user.user_id;
    } catch (error){
        return res.status(400).json({ message: 'Invalid token.' });
    }

    if(user_id != current_user_id){
        return res.status(401).json({ message: "Unauthroized token." });
    }

    try{
        const friendshipList = await Friendship.GetFriendUserIdList(current_user_id);
        if(!friendshipList){
            await Log.createLog(`An error occured getting friendship list for user_id: ${current_user_id}`, "Friendship", "friendship_controller.js", "Y");
            return res.status(400).json({ message: "An error occured getting friendship list." });
        }

        await Log.createLog(`Friendship list fetched successfully for user_id: ${current_user_id}`, "Friendship", "friendship_controller.js", "N");
        return res.json({ friendshipList });
    } catch (error){
        console.log("Error getting friendship list: ", error);
        await Log.createLog(`An error occured getting friendship list, error: ${error.message}`, "Friendship", "friendship_controller.js", "Y");
        throw error;
    }
}

module.exports = { SendRequest, GetRequests, ApproveRequest, RejectRequest, GetFriendList };