const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder,  ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, PermissionsBitField, PermissionFlagsBits, Collection} = require("discord.js");
const fs = require("fs-extra")
require('dotenv').config()

let NombreBump = fs.readJSONSync("FichierJson/NombreBump.json")
let NombreBumpWeek = fs.readJSONSync("FichierJson/BumpWeek.json")
let ChannelBump = fs.readJSONSync("FichierJson/channelbump.json")
let Role = fs.readJSONSync("FichierJson/Role.json")
let TicketCreate = fs.readJSONSync("FichierJson/TicketCreate.json")

const invites = new Collection();

const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildInvites,
    ] 
});

const TOKEN = process.env.TOKEN

client.on("ready", () => {
    console.log("bot opéationnel")

    client.guilds.cache.forEach(async (guild) => {
        // Fetch all Guild Invites
        const firstInvites = await guild.invites.fetch();
        // Set the key as Guild ID, and create a map which has the invite code, and the number of uses
        invites.set(guild.id, new Collection(firstInvites.map((invite) => [invite.code, invite.uses])));
    });

})


const Embded = (title, description) => {
    const embded = new EmbedBuilder()
        .setColor([176, 76, 164])
        .setTitle(title)
        .setDescription(description)
        .setImage('https://zupimages.net/up/23/52/t1c9.png')
        .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')
        .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' });

    return embded
}

const _setticket = new SlashCommandBuilder()
    .setName('setticket')
    .setDescription('Envoie le message pour les tickets')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);  

const _setverification = new SlashCommandBuilder()
    .setName('setverification')
    .setDescription('Envoie le message pour la charte')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);  

const _classementbump = new SlashCommandBuilder()
    .setName('classementbump')
    .setDescription('Classement Total de Bump + Nombre Total de Bump de la semaine passée')

const _totalbump = new SlashCommandBuilder()
    .setName('totalbump')
    .setDescription('Nombre Total de Bump + Nombre Total de Bump de la semaine')
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )

const _createchannelbump = new SlashCommandBuilder()
    .setName('setchannelbump')
    .setDescription('Création du Channel pour ping de faire un bump')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator); 

const _setrolebump = new SlashCommandBuilder()
    .setName('setrolebump')
    .setDescription('Permet de séléctionner le rôle à ping pour les bumps ')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .addRoleOption((option) =>
        option.setName("role")
        .setDescription('ping le role')
        .setRequired(true)
    )

const _setboutique = new SlashCommandBuilder()
    .setName('setboutique')
    .setDescription('Permet de faire le message pour la boutique')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);  

const _setfonctionnement = new SlashCommandBuilder()
    .setName('setfonctionnement')
    .setDescription('Permet de faire le message pour le fonctionnement')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator);

const commands = [
    _setticket,
    _classementbump,
    _totalbump,
    _createchannelbump,
    _setrolebump,
    _setboutique,
    _setverification,
    _setfonctionnement
];

const sortArray = (array) => {
    let nombresARanger = Object.values(array)
    let utilisateurARanger = Object.keys(array)
    let nombreRanger = []
    let utilisateurRanger = []

    utilisateurRanger[0] = utilisateurARanger[0]
    nombreRanger[0] = nombresARanger[0]
    

    for(indexNombreARanger=1; indexNombreARanger < nombresARanger.length ; indexNombreARanger++){ // Elle regarde tous les indexes du tableau nombresARanger

        let nombreARanger = nombresARanger[indexNombreARanger]
        let nombreEstRange = false

        for(indexNombreRanger=0 ; indexNombreRanger < nombreRanger.length ; indexNombreRanger++ ){ // elle regardes tous les indexes du tableau du bas

            let nombreDuBas = nombreRanger[indexNombreRanger]

            if(nombreDuBas < nombreARanger){

                nombreEstRange = true
                nombreRanger.splice(indexNombreRanger, 0, nombreARanger);
                utilisateurRanger.splice(indexNombreRanger, 0, utilisateurARanger[indexNombreARanger]);
                
                break
            }
        }

        if(nombreEstRange == false){
            nombreRanger.push(nombreARanger)
            utilisateurRanger.push(utilisateurARanger[indexNombreARanger])
        }

    }

    return {nombreRanger: nombreRanger,utilisateurRanger: utilisateurRanger}
}

const getTotalBump = (guildId, userId) => {
    if(NombreBump[guildId] === undefined){  
        NombreBump[guildId] = {}
    }
    
    if(NombreBump[guildId][userId] === undefined){  
        NombreBump[guildId][userId] = 0
    }

    return NombreBump[guildId][userId] 
}

const getWeeklyBump = (guildId, weekId, userId) => {
    if(NombreBumpWeek[guildId] === undefined){  
        NombreBumpWeek[guildId] = {}
    }
    
    if(NombreBumpWeek[guildId][weekId] === undefined) {
        NombreBumpWeek[guildId][weekId] = {}
    }

    if(NombreBumpWeek[guildId][weekId][userId] === undefined){  
        NombreBumpWeek[guildId][weekId][userId] = 0
    }

    return NombreBumpWeek[guildId][weekId][userId] 
}

const getRoleChannel = (guildID) => {
    var guild = client.guilds.cache.get(guildID);
    if (ChannelBump[guildID] == undefined) {
        const channel = guild.channels.cache.filter(c => c.type === 0).find(x => x.position == 0);
        ChannelBump[guildID] = channel.id
        fs.writeJSONSync("FichierJson/Role.json", ChannelBump)
    }
    return guild.channels.cache.get(ChannelBump[guildID])
}

const getTicketCreate = (guildId, userId,) => {
    if(TicketCreate[guildId] === undefined){  
        TicketCreate[guildId] = {}
    }
    
    if(TicketCreate[guildId][userId] === undefined) {
        TicketCreate[guildId][userId] = false
    }


    return TicketCreate[guildId][userId]
}


let config

(async () => {
    try {
        config = await fs.readJson('./config.json')
    } catch (error) {
        config = {}
        await fs.writeJson('./config.json', config)
    }
})();


const rest = new REST({ version: '10' }).setToken(TOKEN);
(async () => {
    try {
        console.log('Started refreshing application (/) commands.');
    
        await rest.put(Routes.applicationCommands("1042462467705540609"), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try{
        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            if (interaction.commandName === 'setticket') {

                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("open")
                        .setLabel('⚖️')
                        .setStyle(ButtonStyle.Secondary)
                        
                )    
                const embded = Embded(
                    `⚖️・ __Support__`, 
                    `**__\`CONDITIONS DE CRÉATION D'UN TICKET\`__**\n\n
                    **・Être poli, nous ne sommes pas des __robots__**\n
                    **・Ne pas mentionner le Staff**\n
                    **・Avoir au préalable analyser la demande**\n\n
                    **__Merci de votre compréhension !__**\n\n
                        *Tout abus pourra engendrer une **sanction***`
                )
                    client.channels.cache.get(`1059191214861201478`).send({embeds: [embded], components: [row]})
            
            }

            if (interaction.commandName === 'setverification') {

                const row = new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("accept")
                        .setLabel('✅')
                        .setStyle(ButtonStyle.Secondary)
                        
                )    
                const embded = Embded(
                    `⏳・ __Vérification__`, 
                    `**・Pour le bon fonctionnement du serveur une validation est obligatoire.**\n
                    **_En acceptant le réglement vous accederez au serveur !_**`
                )
                    client.channels.cache.get(`1059148544591810641`).send({embeds: [embded], components: [row]})
            
            }

            if (interaction.commandName === 'setboutique') {               
                
                const embded = Embded(
                    ` 🛒 ・ __Boutique__`, 
                    `**1️⃣・ __Offre n°1__**\n
                        **__Bot Modération__ - 7€**\n
                        \`- /ban : Ban un utilisateur\`
                        \`- /kick : Kick un utilisateur\`
                        \`- /tempsMute : Mute + Temps du mute\`
                        \`- /tempsBan : Ban + Temps du ban\`
                        \`- /warn : Avertit un utilisateur + Raison\`
                        \`- /warnClear : Supprimer tous les avertissements d'un utilisateur\`
                        \`- /casier : Permet de voir toutes les sanctions émis contre l'utilisateur\`\n\n
                        **2️⃣・ __Offre n°2__**\n
                        **__Bot Ticket__ - 5€**\n
                        \`Mise en place d'un Ticket Tool\`\n
                        ↪️ Le même que celui de <@1042462467705540609>\n\n
                        **3️⃣・ __Offre n°3__**\n
                        **__Bot Ticket__ + __Bot Modération__ - 10€**\n\n
                        **Pour choisir une offre, veuillez cliquer sur la réaction correspondante !**\n\n
                    *Tout abus pourra engendrer une **sanction***`
                )
                client.channels.cache.get(`1060631932905472050`).send({embeds: [embded],
                components : [

                    new ActionRowBuilder().setComponents(
                    new ButtonBuilder()
                        .setCustomId("Offre・1")
                        .setLabel('1️⃣')
                        .setStyle(ButtonStyle.Secondary), 
                    new ButtonBuilder()
                        .setCustomId("Offre・2")
                        .setLabel('2️⃣')
                        .setStyle(ButtonStyle.Secondary),
                    new ButtonBuilder()
                        .setCustomId("Offre・3")
                        .setLabel('3️⃣')
                        .setStyle(ButtonStyle.Secondary)
                ) 
                ] })
            
            }

            if (interaction.commandName === 'setfonctionnement') {
                            
                const embded = Embded(
                    `🎈・ __Fonctionnement__`, 
                    `**・__Soon...__**`
                )
                    client.channels.cache.get(`1059151163813007420`).send({embeds: [embded]})
            
            }

            if (interaction.commandName === 'setchannelbump') {
                const embded5 = new EmbedBuilder()
                    .setColor([176, 76, 164])
                    .setTitle('・SetChannelBump')
                    .setDescription(`**Voici le Channel où il y aura les ping pour faire les bumps**`)
                    .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')
                    .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' });
                    
                await interaction.reply({embeds: [embded5]})
                
                let _ChannelBump = interaction.channelId
                let _guildid = interaction.guildId
                ChannelBump[_guildid] = _ChannelBump
                console.log(ChannelBump)
                fs.writeJSONSync("FichierJson/channelbump.json", ChannelBump)
            }

            if (interaction.commandName === 'setrolebump') {

                let _Role = interaction.options.get('role').value
                let _guildid = interaction.guildId
                Role[_guildid] = _Role
        
                fs.writeJSONSync("FichierJson/Role.json", Role)
        
                const embded5 = new EmbedBuilder()
                    .setColor([176, 76, 164])
                    .setTitle('・SetRoleBump')
                    .setDescription(`**Voici le role qui sera ping :** <@&${_Role}>`)
                    .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')
                    .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' });
                    
                await interaction.reply({embeds: [embded5]})
                
            }
        }

        if (interaction.commandName === 'totalbump') { 
            let _guildid = interaction.guildId
            let pseudo = interaction.options.get('pseudo');
            
            let firstDay = 1668380400 - 604800 // Seconde
            let date = Date.now() / 1000 // Milliseconde
            let tempsEcoule = date - firstDay
            let semaineID = tempsEcoule / 604800
            semaineID = (Math.trunc(semaineID))

            const embded = Embded(
                `🚀・ __Bump__`, 
                `**・${pseudo.member.user.username} a effectué ${getTotalBump(_guildid, pseudo.value)} Bump(s) au Total !\n
                ・Avec un Total de ${getWeeklyBump(_guildid, semaineID, pseudo.value)} Bump(s) cette semaine**`)
                
            await interaction.reply({embeds: [embded]})
            
        }

        if (interaction.commandName === 'classementbump') { 
            let _guildid = interaction.guildId 
            
            let firstDay = 1668380400 - 604800 // Seconde
            let date = Date.now() / 1000 // Milliseconde
            let tempsEcoule = date - firstDay
            let semaineID = tempsEcoule / 604800
            semaineID = (Math.trunc(semaineID))
            let lastWeek = semaineID - 1
            
            if (NombreBumpWeek[_guildid] == undefined) {
                NombreBumpWeek[_guildid] = {}
            }
    
            if (NombreBumpWeek[_guildid][lastWeek] == undefined) {
                NombreBumpWeek[_guildid][lastWeek] = {}
            }
    
                if (NombreBump[_guildid] == undefined) {
                NombreBump[_guildid] = {}
            }
    
            const { nombreRanger: nombreRangerTotal, utilisateurRanger: utilisateurRangerTotal } = sortArray(NombreBump[_guildid])
            const { nombreRanger: nombreRangerWeek, utilisateurRanger: utilisateurRangerWeek } = sortArray(NombreBumpWeek[_guildid][lastWeek])
    
    
            console.log(utilisateurRangerTotal)
    
            let rankUser1 = client.users.cache.find(user => user.id === utilisateurRangerTotal[0])
            let rankUser2 = client.users.cache.find(user => user.id === utilisateurRangerTotal[1])
            let rankUser3 = client.users.cache.find(user => user.id === utilisateurRangerTotal[2])
            let rankUser4 = client.users.cache.find(user => user.id === utilisateurRangerTotal[3])
            let rankUser5 = client.users.cache.find(user => user.id === utilisateurRangerTotal[4])
    
            let rankUserWeek1 = client.users.cache.find(user => user.id === utilisateurRangerWeek[0])
            let rankUserWeek2 = client.users.cache.find(user => user.id === utilisateurRangerWeek[1])
            let rankUserWeek3 = client.users.cache.find(user => user.id === utilisateurRangerWeek[2])
            let rankUserWeek4 = client.users.cache.find(user => user.id === utilisateurRangerWeek[3])
            let rankUserWeek5 = client.users.cache.find(user => user.id === utilisateurRangerWeek[4])
    
            let Message = "**Le classement est Vide pour le moment !**"
            
                                            
            if(rankUser1 != undefined){
                Message =  `**・__Classement Total Bump__**\n \n**1️⃣・ ${rankUser1.username} avec ${nombreRangerTotal[0]} Bump(s) au Total**`      
            }
                
            if(rankUser2 != undefined){
                Message = Message+ `\n**2️⃣・ ${rankUser2.username} avec ${nombreRangerTotal[1]} Bump(s) au Total**`       
            }
    
            if(rankUser3 != undefined){
                Message = Message+ `\n**3️⃣・ ${rankUser3.username} avec ${nombreRangerTotal[2]} Bump(s) au Total**`     
            }
    
            if(rankUser4 != undefined){
                Message = Message+ `\n**4️⃣・ ${rankUser4.username} avec ${nombreRangerTotal[3]} Bump(s) au Total**`     
            }
    
            if(rankUser5 != undefined){
                Message = Message+ `\n**5️⃣・ ${rankUser5.username} avec ${nombreRangerTotal[4]} Bump(s) au Total**`     
            }
    
    
            if(rankUserWeek1 != undefined){
                Message = Message+ `\n \n**・__Classement Total Bump__ _(Semaine dernière)_**\n \n**1️⃣・ ${rankUser1.username} avec ${nombreRangerWeek[0]} Bump(s)**`  
            }
    
            if(rankUserWeek2 != undefined){
                Message = Message+ `\n**2️⃣・ ${rankUserWeek2.username} avec ${nombreRangerWeek[1]} Bump(s)**`  
            }
    
            if(rankUserWeek3 != undefined){
                Message = Message+ `\n**3️⃣・ ${rankUserWeek3.username} avec ${nombreRangerWeek[2]} Bump(s)**`  
            }
    
            if(rankUserWeek4 != undefined){
                Message = Message+ `\n**4️⃣・ ${rankUserWeek4.username} avec ${nombreRangerWeek[3]} Bump(s)**`  
            }
    
            if(rankUserWeek5 != undefined){
                Message = Message+ `\n**5️⃣・ ${rankUserWeek5.username} avec ${nombreRangerWeek[4]} Bump(s)**`  
            }
    
        const embded5 = new EmbedBuilder()
            .setColor([176, 76, 164])
            .setTitle('🏆・CLassement')
            .setDescription(Message)
            .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')
            .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' })
            .setImage('https://zupimages.net/up/23/52/t1c9.png')
            
            await interaction.reply({embeds: [embded5]})
        
        }

    }

    catch (error) {
        const embded = Embded(
            `⚖️・ __Dev Laboratory__`, 
            `**__\`Bienvenue sur le support\`__**\n\n
            **・Tu ne peux pas utiliser cette commande!**\n`
        )
            
        interaction.user.send({embeds: [embded]})
    }  
})

client.on('messageCreate', async message => {
    if(message.author.id == "302050872383242240") {
        
        if(message.interaction.commandName === 'bump'){
            
            let _guildid = message.guildId
            let _TotalBump = getTotalBump(_guildid, message.interaction.user.id)
            
            NombreBump[_guildid][message.interaction.user.id] = _TotalBump+ 1          
            
            fs.writeJSONSync("FichierJson/NombreBump.json", NombreBump)
        
            let firstDay = 1668380400 - 604800 // Seconde
            let date = Date.now() / 1000 // Milliseconde
            let tempsEcoule = date - firstDay
            let semaineID = tempsEcoule / 604800
            semaineID = (Math.trunc(semaineID))

            let _WeeklyBump = getWeeklyBump(_guildid, semaineID, message.interaction.user.id)

            NombreBumpWeek[_guildid][semaineID][message.interaction.user.id] = _WeeklyBump + 1 
            fs.writeJSONSync("FichierJson/BumpWeek.json", NombreBumpWeek)

            let channel = getRoleChannel(_guildid)
            setTimeout(function() {
                const embded5 = new EmbedBuilder()
                    .setColor([176, 76, 164])
                    .setTitle('🚀・Bump')
                    .setDescription(`⏰ **DRINNG**\n\n**C'est l'heure du Bump !**\n<@&${Role[_guildid]}>`)
                    .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')
                    .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' })
                    .setImage('https://zupimages.net/up/23/52/t1c9.png')
                                
                channel.send({embeds: [embded5], content: `||<@&${Role[_guildid]}>||`})
                
                }, 7200000);
        }
    }
});

client.on(Events.InteractionCreate, interaction => {

    _guildid = interaction.guild.id
    _userid = interaction.user.id

    if (!interaction.isButton()) return;
        if (interaction.customId === 'open' && getTicketCreate(_guildid, _userid) ==  false ){
        let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');
        interaction.guild.channels.create(
            { 
                name: `Ticket de ${interaction.user.username}`,  
                parent:`1059889680411283536`, 
                permissionOverwrites: [
                    {
                        id: everyoneRole.id,
                        deny: [PermissionsBitField.Flags.ViewChannel],
                    },{
                        id: interaction.user.id,
                        allow: [PermissionsBitField.Flags.ViewChannel],
                    },
                ], 
            }
            
        )

        TicketCreate[_guildid][_userid] =  true
        fs.writeJSONSync("FichierJson/TicketCreate.json", TicketCreate)
            
        interaction.deferUpdate();

        }

        if (interaction.customId === 'Offre・1' && getTicketCreate(_guildid, _userid) ==  false){
            _guildid = interaction.guild.id
            _userid = interaction.user.id
            let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

            interaction.guild.channels.create(
                { 
                    name: `Ticket de ${interaction.user.username}`,  
                    parent:`1060649332124155984`, 
                    permissionOverwrites: [
                        {
                            id: everyoneRole.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },{
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ], 
                    
                }

            )

            TicketCreate[_guildid][_userid] =  true
            fs.writeJSONSync("FichierJson/TicketCreate.json", TicketCreate)

            interaction.deferUpdate();
        }

        if (interaction.customId === 'Offre・2' && getTicketCreate(_guildid, _userid) ==  false){
            let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

            interaction.guild.channels.create(
                { 
                    name: `Ticket de ${interaction.user.username}`,  
                    parent:`1060661243393884200`, 
                    permissionOverwrites: [
                        {
                            id: everyoneRole.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },{
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ], 
                }
            )

            TicketCreate[_guildid][_userid] =  true
            fs.writeJSONSync("FichierJson/TicketCreate.json", TicketCreate)

            interaction.deferUpdate();
        }

        if (interaction.customId === 'Offre・3' && getTicketCreate(_guildid, _userid) ==  false){
            let everyoneRole = interaction.guild.roles.cache.find(r => r.name === '@everyone');

            interaction.guild.channels.create(
                { 
                    name: `Ticket de ${interaction.user.username}`,  
                    parent:`1060746611912880198`, 
                    permissionOverwrites: [
                        {
                            id: everyoneRole.id,
                            deny: [PermissionsBitField.Flags.ViewChannel],
                        },{
                            id: interaction.user.id,
                            allow: [PermissionsBitField.Flags.ViewChannel],
                        },
                    ], 
                }
            )

            TicketCreate[_guildid][_userid] =  true
            fs.writeJSONSync("FichierJson/TicketCreate.json", TicketCreate)

            interaction.deferUpdate();
        }

        if (interaction.customId === 'accept') {
            
            const member = interaction.guild.members.cache.get(interaction.user.id);
            const role = interaction.guild.roles.cache.get('1059145300759040161');
            member.roles.add(role)

            interaction.deferUpdate();
        }

    
    else if (interaction.customId === 'close'){
        try {
            if (interaction.member.permissions.has("ADMINISTRATOR")){

                if (!interaction.isButton()) return;

                interaction.channel.delete();    
                
                TicketCreate[_guildid][_userid] =  false
                fs.writeJSONSync("FichierJson/TicketCreate.json", TicketCreate)
                
                interaction.deferUpdate();
            }
        } catch (error) {
            const embded = Embded(
                `⚖️・ __Dev Laboratory__`, 
                `**__\`Bienvenue sur le support\`__**\n\n
                **・Tu ne peux pas fermer le Ticket !**\n`
            )

            interaction.user.send({embeds: [embded]})
            interaction.deferUpdate();
        }
    }    

});

client.on("channelCreate", (channel) => {
    if (channel.parentId == `1059889680411283536`){
        
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        )  

        const embded = Embded(
            `⚖️・ __Support__`, 
            `**__\`Bienvenue sur le support\`__**\n\n
            **・Un membre du Staff va s'occuper de toi **\n
            _Patiente quelques instants..._`
        )
                
        channel.send({embeds: [embded], components: [row]})
    } 

    if (channel.parentId == `1060649332124155984`){
    
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        )  

        const embded = Embded(
            `🛒・ __Boutique__`, 
            `**__\`Bienvenue sur la boutique !\`__**\n\n
            **・Tu as choisis <@&1060662177595404328>**
            **・Un membre du Staff va s'occuper de toi **\n
            _Patiente quelques instants..._`
        )
                
        channel.send({embeds: [embded], components: [row]})
    } 

    if (channel.parentId == `1060661243393884200`){
    
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        )  

        const embded = Embded(
            `🛒・ __Boutique__`, 
            `**__\`Bienvenue sur la boutique !\`__**\n\n
            **・Tu as choisis <@&1060662402171027456>**
            **・Un membre du Staff va s'occuper de toi **\n
            _Patiente quelques instants..._`
        )
                
        channel.send({embeds: [embded], components: [row]})
    } 

    if (channel.parentId == `1060746611912880198`){
    
        const row = new ActionRowBuilder().setComponents(
            new ButtonBuilder()
                .setCustomId("close")
                .setLabel('Close')
                .setStyle(ButtonStyle.Danger)
        )  

        const embded = Embded(
            `🛒・ __Boutique__`, 
            `**__\`Bienvenue sur la boutique !\`__**\n\n
            **・Tu as choisis <@&1060746814803951656>**
            **・Un membre du Staff va s'occuper de toi **\n
            _Patiente quelques instants..._`
        )
                
        channel.send({embeds: [embded], components: [row]})
    } 


});

client.on('guildMemberAdd', async member => {
    
    let newInvites = await member.guild.invites.fetch()
    let oldInvites = invites.get(member.guild.id);
    let invite = newInvites.find(i => i.uses > oldInvites.get(i.code));
    const inviter = await client.users.fetch(invite.inviter.id);


    invites.set(member.guild.id, new Map(newInvites.map((invite) => [invite.code, invite.uses])));

    let embded

    invite ?  
        
        embded = new EmbedBuilder()
            .setColor([176, 76, 164])
            .setTitle('✉️・ __Invitation__')
            .setDescription(`**・${member.user} Bienvenue sur ${member.guild.name} !\n\n ・Tu as été invité par ${inviter}.**\n`)
            .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' })
            .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')                
    : 
        embded = new EmbedBuilder()
            .setColor([176, 76, 164])
            .setTitle('✉️・ __Invitation__')
            .setDescription(`**${member.user.tag} a rejoint, mais je n'ai pas trouvé par quelle invitation.**\n`)
            .setFooter({ text: 'Dev Laboratory', iconURL: 'https://zupimages.net/up/23/52/0ikn.png' })
            .setThumbnail('https://zupimages.net/up/23/52/0ikn.png')    

    client.channels.cache.get(`1059152262649348226`).send({embeds: [embded]})

        

});

client.login(TOKEN);