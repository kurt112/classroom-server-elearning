const {
    userJoinClass,
    userLeave,
    sendMessage,
    getClassData,
    getClasses
} = require('../utils/users');

const moment = require('moment')
const {use} = require("express/lib/router");
const m = moment()
const videos = new Map()
const socket = (io) => {
    io.on('connection', (socket) => {

        socket.on('joinClass', ({path, name, role,classes}) => {

            userJoinClass(socket.id, name, role, path,classes)
            socket.join(path)


            // for getting the data in dashboard
            io.emit('dashboardData', getClasses())

            /// for getting the chats
            io.to(path).emit('classData', getClassData(path));


            // for getting the send message
            socket.on('sendMessage', (message, time, isAnnouncement, setMessage) => {
                if (setMessage !== undefined) setMessage()
                io.to(path).emit('messages', sendMessage(path, message, name, time, isAnnouncement))
            })

            // to get all users online and offlne
            socket.on('users',() => {
                io.to(path).emit('getUsers', {...getClassData(path)})
            })


            // handle disconnection
            socket.on('disconnect', () => {
                io.to(path).emit('user-disconnected', socket.id)
                io.to(path).emit('messages', sendMessage(path, name + ' Has Left The Class ', name, m.format('h:mm a'), true))
                userLeave(socket.id, path)
                io.to(path).emit('getUsers', {...getClassData(path)})
                io.emit('dashboardData', getClasses())

            })


        })


        // get all data when dashbaord load
        socket.on('dashboard', () =>{
            io.emit('dashboardData',getClasses())
        })


        // joining in video
        socket.on('join-video', (path,userId) => {
            const id = socket.id
            socket.join(path)
            socket.broadcast.to(path).emit('user-connected',userId)
            videos.set(id,userId)
            console.log('before')
            console.log(videos)
            socket.on('disconnect', () => {
                videos.delete(id);

                socket.broadcast.to(path).emit('user-diconnected',userId)
            })

        })


        socket.on('remove-video', (path) =>{

            socket.join(path)
            const data = videos.get(socket.id)
            if(data !==undefined){
                io.to(path).emit('refresh',socket.id)
                socket.broadcast.to(path).emit('user-diconnected',data)
            }
        })




    })

}

module.exports = socket