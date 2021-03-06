const classroomData = new Map();

// Hash map sample classroomData
// const newData = [
//     {
//         classId: 1,
//         users: [],
//         messages: []
//
//     }
// ]


// message skeleton data
// const messageData = {
//     isAnnouncement: true,
//     message: {
//         user,
//         text,
//         time
//     }
// }


const userJoinClass = (id, username, role, classId,classes) => {

    // Create New Data If The Class Id is empty
    if (classroomData.get(classId) === undefined) {
        classroomData.set(classId, {
                classId: 1,
                users: [],
                messages: [],
                classes
            }
        )
    }

    classroomData.get(classId).users.push({id, username, role})

}

// get current user
const getCurrentUser = (id, classId) => classroomData.get(classId).users.find(user => user.id === id)


// user leaves chat
const   userLeave = (id, classId) => {

    const index = classroomData.get(classId).users.findIndex(user => user.id === id)

    if (index !== -1){
        const newData = classroomData.get(classId).users.splice(index, 1)[0]


        if(classroomData.get(classId).users.length ===0)
            classroomData.delete(classId)



        return newData
    }


}

// Send Message

const sendMessage = (classId, message, sender, time, isAnnouncement) => {

    const messageData = {
        isAnnouncement,
        message: {
            sender,
            message,
            time
        }
    }

    classroomData.get(classId).messages.push(messageData)


    return messageData
}

// Get class users
const getClassUsers = (classId) => classroomData.get(classId).users

// Get Class Data
const getClassData = (classId) => classroomData.get(classId)

const getClasses = () => {
    const array = []
    classroomData.forEach(e => {
        array.push(e)
    })

    return array
}

module.exports = {
    userJoinClass,
    getClassUsers,
    getCurrentUser,
    userLeave,
    getClassData,
    sendMessage,
    getClasses
}






