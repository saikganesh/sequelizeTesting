(async ()=>{

    const {Sequelize, DataTypes, Op} = require('sequelize')
    
    try 
    {
        const sequelize = new Sequelize('sequelizeTesting','root','root',{
            dialect : 'mysql',
            host : 'localhost',
            logging : false,
        })
    
        await sequelize.authenticate()
        console.log('Connection Established')
    
        const User = sequelize.define('user',{
            name : {
                type : DataTypes.STRING,
                unique : true,
                allowNull : false
                
            },
        },{
            timestamps : false
        })

        const Task = sequelize.define('task',{
            name : {
                type : DataTypes.STRING,
                unique : true,
                allowNull : false
            }
        },{
            timestamps : false
        })

        User.belongsToMany(Task,{
            through : 'assignment',
            sourceKey : 'id',
            foreignKey : 'assignedPerson'
        })

        Task.belongsToMany(User,{
            through : 'assignment',
            sourceKey : 'id',
            foreignKey : 'assignedTask'
        })

        await sequelize.sync({force:true})

        console.log('Inserting data 1')

        const user1 = await User.create({
            name : 'sai'
        })

        console.log('Inserting data 2')

        const user2 = await User.create({
            name : 'nithesh'
        })

        const task1 = await Task.create({
            name : 'brush'
        })

        const task2 = await Task.create({
            name : 'walk'
        })

        const task3 = await Task.create({
            name : 'squash'
        })

        await user1.addTasks([task1,task3])
        await user2.addTasks([task2])

        const result = await User.findAll({
            include : {
                model : Task,
                through : {
                    where : [
                        {userId : 1},    
                        {taskId : 1}
                    ],
                    fields : ['userId','taskId']
                }
            }
        })

        console.log(result)
        console.log('Process completed')

    }
    catch(error)
    {
        console.log('Error :',error.message)
    }
    
})()