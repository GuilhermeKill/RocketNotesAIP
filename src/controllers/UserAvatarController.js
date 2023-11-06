const knex = require("../database/knex");
const AppError = require("../utils/AppError");
const DiskStorage = require("../providers/DiskStorage");

class UserAvatarController {
    async update(request, response){
        const user_id = request.user.id;
        const avatarFileName = request.file.filename;

        const diskStorage = new DiskStorage();
        
        const user = await knex("users").where({ id: user_id }).first();
        
        if(!user){
            throw new AppError("O usuário precisa estar autenticado", 401);
        }

        
        if(user.avatar){
            diskStorage.deleFile(user.avatar);
        }

        console.log(user)
        
        const fileName = await diskStorage.saveFile(avatarFileName);

        
        user.avatar = fileName; 
        
        await knex("users").update(user).where({ id: user_id });
        
        console.log(user)
        return response.json();
    }

}


module.exports = UserAvatarController