const { Client, GatewayIntentBits, SlashCommandBuilder, REST, Routes, EmbedBuilder} = require("discord.js");
const fs = require("fs-extra")
let BanTime = fs.readJSONSync("TempsBan.json")
let MuteTime = fs.readJSONSync("TempsMute.json")
let Casier = fs.readJSONSync("Casier.json")
let WarnList = fs.readJSONSync("WarnList.json")
let BanList = fs.readJSONSync("BanList.json")
let TempsBanList = fs.readJSONSync("TempsBanList.json")
let TempsMuteList = fs.readJSONSync("TempsMuteList.json")
let CasierWarnList = fs.readJSONSync("CasierWarnList.json")
let Xp = fs.readJSONSync("Xp.json")



const client = new Client({ 
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences

    ] 
});
const TOKEN =
    'MTA0NDI0MzQ0NjgzMzA4NjU3NA.G17DOj.XptLRRkZkYrfc9sOzPYHpbUWnirhnnFMPw73PI';

client.on("ready", () => {
    console.log("bot opéationnel");

})

const _ban = new SlashCommandBuilder()
    .setName('ban')
    .setDescription('/ban + [user] + [raison]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("raison")
        .setDescription('Donne la raison')
        .setRequired(true)
    )

const _kick = new SlashCommandBuilder()
    .setName('kick')
    .setDescription('/ban + [user] + [raison]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("raison")
        .setDescription('Donne la raison')
        .setRequired(true)
    )

const _tempsban = new SlashCommandBuilder()
    .setName('tempsban')
    .setDescription('/tempban + [user] + [raison] + [temps]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("raison")
        .setDescription('Donne la raison')
        .setRequired(true)
    )

    .addStringOption((option) =>
        option.setName("temps")
        .setDescription('Donne le temps')
        .setRequired(true)
    )

    .addStringOption((option) =>
        option.setName('unite')
			.setDescription('Unité du temps de ban')
			.setRequired(true)
			.addChoices(
				{ name: 'Seconde(s)', value: 'seconde' },
				{ name: 'Minute(s)', value: 'minute' },
				{ name: 'Heure(s)', value: 'heure' },
                { name: 'Jour(s)', value: 'jour' },
                { name: 'Mois', value: 'mois' },
				{ name: 'Année(s)', value: 'annee' },
            )
    )

const _tempmutes = new SlashCommandBuilder()
    .setName('tempsmute')
    .setDescription('/tempmute + [user] + [raison] + [temps]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("raison")
        .setDescription('Donne la raison')
        .setRequired(true)
    )

    .addStringOption((option) =>
        option.setName("temps")
        .setDescription('Donne le temps')
        .setRequired(true)
    )

    .addStringOption((option) =>
        option.setName('unite')
			.setDescription('Unité du temps de ban')
			.setRequired(true)
			.addChoices(
				{ name: 'Seconde(s)', value: 'seconde' },
				{ name: 'Minute(s)', value: 'minute' },
				{ name: 'Heure(s)', value: 'heure' },
                { name: 'Jour(s)', value: 'jour' },
                { name: 'Mois', value: 'mois' },
				{ name: 'Année(s)', value: 'annee' },
            )
    )

const _casier = new SlashCommandBuilder()
    .setName('casier')
    .setDescription('/casier + [user]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )

const _warn = new SlashCommandBuilder()
    .setName('warn')
    .setDescription('/warn + [user] + [raison]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
    .addStringOption((option) =>
        option.setName("raison")
        .setDescription('Donne la raison')
        .setRequired(true)
    )

    const _warnlist = new SlashCommandBuilder()
    .setName('warnlist')
    .setDescription('/warn + [user]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )
 
const _warnremove = new SlashCommandBuilder()
    .setName('warnremove')
    .setDescription('/warnremove + [user]')
    
    .addMentionableOption((option) =>
        option.setName("pseudo")
        .setDescription('ping la personne')
        .setRequired(true)
    )


const commands = [

    _ban,
    _kick,
    _tempsban,
    _tempmutes,
    _casier,
    _warn,
    _warnlist,
    _warnremove

];

const getTempsBan = (guildId, userId) => {
    if(BanTime[guildId] === undefined){  
        BanTime[guildId] = {}
    }

    if(BanTime[guildId][userId] === undefined){  
        BanTime[guildId][userId] = 0
    }

    return BanTime[guildId][userId]
}

const getTempsMute = (guildId, userId) => {
    if(MuteTime[guildId] === undefined){  
        MuteTime[guildId] = {}
    }

    if(MuteTime[guildId][userId] === undefined){  
        MuteTime[guildId][userId] = 0
    }

    return MuteTime[guildId][userId]
}

const getCasier = ( guildId, userId) => {
    
    if(Casier[guildId]  === undefined){  
        Casier[guildId]  = {}
    }

    if(Casier[guildId][userId] === undefined){  
        Casier[guildId][userId] = {
            banCount : 0, 
            kickCount : 0,
            tempsMuteCount : 0,
            tempsBanCount : 0,
            warnCount : 0,             
            }
    }

    return Casier[guildId][userId]
}

const getWarnList = (guildId, userId) => {    
    if(WarnList[guildId]  === undefined){  
        WarnList[guildId]  = {}
    }

    if(WarnList[guildId][userId] === undefined){  
        WarnList[guildId][userId] = []
    }

    return WarnList[guildId][userId]
}

const getBanList = (guildId, userId) => {    
    if(BanList[guildId]  === undefined){  
        BanList[guildId]  = {}
    }


    if(BanList[guildId][userId] === undefined){  
        BanList[guildId][userId] = []
    }

    return BanList[guildId][userId]
}

const getTempsBanList = (guildId, userId) => {    
    if(TempsBanList[guildId]  === undefined){  
        TempsBanList[guildId]  = {}
    }


    if(TempsBanList[guildId][userId] === undefined){  
        TempsBanList[guildId][userId] = []
    }

    return TempsBanList[guildId][userId]
}

const getTempsMuteList = (guildId, userId) => {    
    if(TempsMuteList[guildId]  === undefined){  
        TempsMuteList[guildId]  = {}
    }


    if(TempsMuteList[guildId][userId] === undefined){  
        TempsMuteList[guildId][userId] = []
    }

    return TempsMuteList[guildId][userId]
}

const getXp = (guildId, userId) => {    
    if(Xp[guildId]  === undefined){  
        Xp[guildId]  = {}
    }


    if(Xp[guildId][userId] === undefined){  
        Xp[guildId][userId] = 0
    }

    return Xp[guildId][userId]
}

const getCasierWarnList = (guildId, userId) => {    
    if(CasierWarnList[guildId]  === undefined){  
        CasierWarnList[guildId]  = {}
    }


    if(CasierWarnList[guildId][userId] === undefined){  
        CasierWarnList[guildId][userId] = []
    }

    return CasierWarnList[guildId][userId]
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
    
        await rest.put(Routes.applicationCommands("1044243446833086574"), { body: commands });
    
        console.log('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
    }
    })();

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    
    try  {
        
        if (interaction.commandName === 'kick') {

            if (interaction.member.permissions.has("KICK_MEMBERS")) {
                const member = interaction.options.get('pseudo');
                
                switch (member.user.id) {
                    
                    case (!member):
                        const embded1 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Kick')
                        .setDescription(`Impossible de trouver cet utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded1]})

                    case (interaction.member.id):

                        const embded2 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Kick')
                        .setDescription(`Impossible de se kick sois-même ! ❌`)
                       
                        await interaction.reply({embeds: [embded2]})
                        

                    case (client.user.id):

                        const embded3 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Kick')
                        .setDescription(`Impossible de me kick ! ❌`)
                       
                        await interaction.reply({embeds: [embded3]})


                    case (!member.bannable):
                        const embded4 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Kick')
                        .setDescription(`Impossible de kick cet Utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded4]})
                        
                    default:
                        const pseudo = interaction.options.get('pseudo')
                        const reason = interaction.options.get('raison');
                        
                        try {
                            
                            
                            let _guildId = interaction.guildId
                            let _userId = pseudo.value
                            
                            getCasier(_guildId, _userId)
                            Casier[_guildId][_userId].kickCount ++
                            fs.writeJSONSync("Casier.json",  Casier )

                            //await interaction.guild.members.kick(member.user, {reason: reason.value})

                           
                            const embded = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Kick')
                                .setDescription(`**${member.user.tag}** a bien été kick ! ✅\n Par : **${interaction.user}**\nRaison : **${reason.value}**\n`)
                               
                                await interaction.reply({embeds: [embded]})

                            
                        } 
                        
                        catch (error) {
                            
                            const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Kick')
                                .setDescription(`Je ne peux pas kick ce joueur ! ❌`)
                               
                            await interaction.reply({embeds: [embded5]})
                            
                        }  

                        break;
                }
            } else {
                const embded6 = new EmbedBuilder()
                    .setColor(0x43EA57)
                    .setTitle('Kick')
                    .setDescription(`Impossible d'utiliser cette commande ! ❌`)
                    
                await interaction.reply({embeds: [embded6]})
            }
        }

        if (interaction.commandName === 'ban') {

            if (interaction.member.permissions.has("BAN_MEMBERS")) {
                const member = interaction.options.get('pseudo');
                
                switch (member.user.id) {
                    
                    case (!member):
                        const embded1 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`mpossible de trouver cet utilisateur ! ❌`)
                       
                    await interaction.reply({embeds: [embded1]})

                    case (interaction.member.id):

                        const embded2 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de se bannir sois-même ! ❌`)
                       
                        await interaction.reply({embeds: [embded2]})
                        

                    case (client.user.id):

                        const embded3 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de me ban ! ❌`)
                       
                        await interaction.reply({embeds: [embded3]})


                    case (!member.bannable):
                        const embded4 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de ban cet Utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded4]})
                        
                    default:
                        const pseudo = interaction.options.get('pseudo')
                        const reason = interaction.options.get('raison');
                        
                        try {
                            
                            let _guildId = interaction.guildId
                            let _userId = pseudo.value
                            
                            getCasier(_guildId, _userId)
                            Casier[_guildId][_userId].banCount ++
                            fs.writeJSONSync("Casier.json",  Casier )

                            getBanList( _guildId, _userId)
                            BanList[_guildId][_userId].push({
                                reason : reason.value,
                                admin : interaction.user.id
                            })
                            fs.writeJSONSync("BanList.json",  BanList )
                                
                            //await interaction.guild.members.ban(member.user, {reason: reason.value});
                           
                            const embded = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`**${member.user.tag}** a bien été Banni ! ✅\n Par : **${interaction.user}**\nRaison : **${reason.value}**\n`)
                               
                                await interaction.reply({embeds: [embded]})
                                
                        } 
                        
                        catch (error) {
                            
                            const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`Je ne peux pas ban ce joueur ! ❌`)
                               
                            await interaction.reply({embeds: [embded5]})
                            
                        }  

                        break;
                }
            } else {
                const embded6 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`Impossible d'utiliser cette commande ! ❌`)
                               
                                await interaction.reply({embeds: [embded6]})
            }
        }

        if (interaction.commandName === 'tempsban') {

            if (interaction.member.permissions.has("BAN_MEMBERS")) {
                const member = interaction.options.get('pseudo');
                
                switch (member.user.id) {
                    
                    case (!member):
                        const embded1 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`mpossible de trouver cet utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded1]})

                    case (interaction.member.id):

                        const embded2 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de se bannir sois-même ! ❌`)
                       
                        await interaction.reply({embeds: [embded2]})
                        

                    case (client.user.id):

                        const embded3 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de me ban ! ❌`)
                       
                        await interaction.reply({embeds: [embded3]})


                    case (!member.bannable):
                        const embded4 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Banissement')
                        .setDescription(`Impossible de ban cet Utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded4]})
                        
                    default:
                        const pseudo = interaction.options.get('pseudo')
                        const reason = interaction.options.get('raison');
                        const time = interaction.options.get('temps');
                        const valeur = interaction.options.get('unite')

                        const seconde1 = 1
                        const minute1 = 60
                        const heure1 = 3600
                        const jour1 = 86400
                        const mois1 = 2629800
                        const annee1 = 31536000
                        let tempsDuBan = 0

                        if(valeur.value == 'seconde'){
                            tempsDuBan = time.value * seconde1
                        }

                        if(valeur.value == 'minute'){
                            tempsDuBan = time.value * minute1
                        }

                        if(valeur.value == 'heure'){
                            tempsDuBan = time.value * heure1 
                        }

                        if(valeur.value == 'jour'){
                            tempsDuBan = time.value * jour1  
                        }

                        if(valeur.value == 'mois'){
                            tempsDuBan = time.value * mois1
                        }

                        if(valeur.value == 'annee'){
                            tempsDuBan = time.value * annee1 
                        }

                        try {
                            

                            let _guildId = interaction.guildId
                            let _userId = pseudo.value
                            let _BanTime =  Date.now() / 1000 + tempsDuBan;
                            
                            getTempsBan(_guildId, _userId)

                            BanTime[_guildId][_userId] = _BanTime 
                            fs.writeJSONSync("TempsBan.json",  BanTime )

                            getCasier(_guildId, _userId)
                            Casier[_guildId][_userId].tempsBanCount ++
                            fs.writeJSONSync("Casier.json",  Casier )

                            getTempsBanList( _guildId, _userId)
                            TempsBanList[_guildId][_userId].push({
                                reason : reason.value,
                                admin : interaction.user.id
                            })
                            fs.writeJSONSync("TempsBanList.json",  TempsBanList )

                           //await interaction.guild.members.ban(member.user, {reason: reason.value});
                           
                           
                            const embded = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`**${member.user.tag}** a bien été Banni ! ✅\n Par : **${interaction.user}**\nRaison : **${reason.value}\n**Temps : **${time.value} ${valeur.value}**`)
                               
                             await interaction.reply({embeds: [embded]})
                        } 
                        
                        catch (error) {
                            
                            const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`Je ne peux pas ban ce joueur ! ❌`)
                               
                             await interaction.reply({embeds: [embded5]})
                            
                        }  

                        break;
                }
            } else {
                const embded6 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Banissement')
                                .setDescription(`Impossible d'utiliser cette commande ! ❌`)
                               
                             await interaction.reply({embeds: [embded6]})
            }
        }

        if (interaction.commandName === 'tempsmute') {

            if (interaction.member.permissions.has("MUTE_MEMBERS")) {
                const member = interaction.options.get('pseudo');
                
                switch (member.user.id) {
                    
                    case (!member):
                        const embded1 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Mute')
                        .setDescription(`Impossible de trouver cet utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded1]})

                    case (interaction.member.id):

                        const embded2 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Mute')
                        .setDescription(`Impossible de se Mute sois-même ! ❌`)
                       
                        await interaction.reply({embeds: [embded2]})
                        

                    case (client.user.id):

                        const embded3 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Mute')
                        .setDescription(`Impossible de me Mute ! ❌`)
                       
                        await interaction.reply({embeds: [embded3]})


                    case (!member.bannable):
                        const embded4 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Mute')
                        .setDescription(`Impossible de Mute cet Utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded4]})
                        
                    default:
                        const pseudo = interaction.options.get('pseudo')
                        const reason = interaction.options.get('raison');
                        const time = interaction.options.get('temps');
                        const valeur = interaction.options.get('unite')

                        const seconde1 = 1
                        const minute1 = 60
                        const heure1 = 3600
                        const jour1 = 86400
                        const mois1 = 2629800
                        const annee1 = 31536000
                        let tempsDuMute = 0

                        if(valeur.value == 'seconde'){
                            tempsDuMute = time.value * seconde1
                        }

                        if(valeur.value == 'minute'){
                            tempsDuMute = time.value * minute1
                        }

                        if(valeur.value == 'heure'){
                            tempsDuMute = time.value * heure1 
                        }

                        if(valeur.value == 'jour'){
                            tempsDuMute = time.value * jour1  
                        }

                        if(valeur.value == 'mois'){
                            tempsDuMute = time.value * mois1
                        }

                        if(valeur.value == 'annee'){
                            tempsDuMute = time.value * annee1 
                        }

                        try {
                            

                            let _guildId = interaction.guildId
                            let _userId = pseudo.value
                            let _MuteTime =  Date.now() / 1000 + tempsDuMute;
                            
                            getTempsMute(_guildId, _userId)

                            MuteTime[_guildId][_userId] = _MuteTime 
                            fs.writeJSONSync("TempsMute.json",  MuteTime )

                            getCasier(_guildId, _userId)
                            Casier[_guildId][_userId].tempsMuteCount ++
                            fs.writeJSONSync("Casier.json",  Casier )

                            getTempsMuteList( _guildId, _userId)
                            TempsMuteList[_guildId][_userId].push({
                                reason : reason.value,
                                admin : interaction.user.id
                            })
                            fs.writeJSONSync("TempsMuteList.json",  TempsMuteList )
                           
                           
                           
                            const embded = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Mute')
                                .setDescription(`**${member.user.tag}** a bien été Mute ! ✅\n Par : **${interaction.user}**\nRaison : **${reason.value}\n**Temps : **${time.value} ${valeur.value}**`)
                               
                             await interaction.reply({embeds: [embded]})
                        } 
                        
                        catch (error) {
                            
                            const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Mute')
                                .setDescription(`Je ne peux pas Mute ce joueur ! ❌`)
                               
                             await interaction.reply({embeds: [embded5]})
                            
                        }  

                        break;
                }
            } else {
                const embded6 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Mute')
                                .setDescription(`Impossible d'utiliser cette commande ! ❌`)
                               
                             await interaction.reply({embeds: [embded6]})
            }
        }

        if (interaction.commandName === 'warn') {

            if (interaction.member.permissions.has("KICK_MEMBERS")) {
                const member = interaction.options.get('pseudo');
                
                switch (member.user.id) {
                    
                    case (!member):
                        const embded1 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Warn')
                        .setDescription(`Impossible de trouver cet utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded1]})

                    case (interaction.member.id):

                        const embded2 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Warn')
                        .setDescription(`Impossible de se Warn sois-même ! ❌`)
                       
                        await interaction.reply({embeds: [embded2]})
                        

                    case (client.user.id):

                        const embded3 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Warn')
                        .setDescription(`Impossible de me Warn ! ❌`)
                       
                        await interaction.reply({embeds: [embded3]})


                    case (!member.bannable):
                        const embded4 = new EmbedBuilder()
                        .setColor(0x43EA57)
                        .setTitle('Warn')
                        .setDescription(`Impossible de Warn cet Utilisateur ! ❌`)
                       
                        await interaction.reply({embeds: [embded4]})
                        
                    default:
                        
                    const pseudo = interaction.options.get('pseudo')
                    const reason = interaction.options.get('raison');

                        try {
                            

                            let _guildId = interaction.guildId
                            let _userId = pseudo.value
                            
                            getCasier(_guildId, _userId)
                            Casier[_guildId][_userId].warnCount ++
                            fs.writeJSONSync("Casier.json",  Casier )

                            
                            getWarnList( _guildId, _userId)
                            WarnList[_guildId][_userId].push(reason.value)
                            fs.writeJSONSync("WarnList.json",  WarnList )

                            getCasierWarnList( _guildId, _userId)
                            CasierWarnList[_guildId][_userId].push({
                                reason : reason.value,
                                admin : interaction.user.id
                            })
                            fs.writeJSONSync("CasierWarnList.json",  CasierWarnList )

                           
                           
                            const embded = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Warn')
                                .setDescription(`**${member.user.tag}** a bien été Warn ! ✅\n Par : **${interaction.user}**\nRaison : **${reason.value}\n**`)
                               
                             await interaction.reply({embeds: [embded]})
                        } 
                        
                        catch (error) {
                            
                            const embded5 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Warn')
                                .setDescription(`Je ne peux pas Warn ce joueur ! ❌`)
                               
                             await interaction.reply({embeds: [embded5]})
                            
                        }  

                        break;
                }
            } else {
                const embded6 = new EmbedBuilder()
                                .setColor(0x43EA57)
                                .setTitle('Warn')
                                .setDescription(`Impossible d'utiliser cette commande ! ❌`)
                               
                             await interaction.reply({embeds: [embded6]})
            }
        }

        if (interaction.commandName === 'warnlist') {

            if (interaction.member.permissions.has("ADMINISTRATOR")) {
                
                const pseudo = interaction.options.get('pseudo')

                let _guildId = interaction.guildId
                let _userId = pseudo.value
               
                let warnListFormate = "" 
                let warnList = getWarnList(_guildId, _userId)

                if(WarnList[_guildId][_userId].length === 0){

                const embded5 = new EmbedBuilder()
                    .setColor(0x43EA57)
                    .setTitle(`📋 Warn de ${pseudo.member.user.username}`)
                    .setDescription(`**Aucun Avertissement !**`)
               
                await interaction.reply({embeds: [embded5]})

                }

                else {
                for(i=0 ; i<warnList.length ; i++){

                    warnListFormate = warnListFormate + "\n#" + (i+1) + " - " +  warnList[i]

                }
                
                
                const embded5 = new EmbedBuilder()
                    .setColor(0x43EA57)
                    .setTitle(`📋 Warn de ${pseudo.member.user.username}`)
                    .setDescription(`**${warnListFormate}**`)
               
                await interaction.reply({embeds: [embded5]})
                }
            }
        }

        if (interaction.commandName === 'casier') {

            if (interaction.member.permissions.has("ADMINISTRATOR")) {
                
                let _guildid = interaction.guildId
                let pseudo = interaction.options.get('pseudo');
                let _userId = pseudo.value
                
                let warnListFormate = ""
                let TempsmuteListFormate = "" 
                let TempsbanListFormate = "" 
                let banListFormate = "" 
                let banList = getBanList(_guildid, _userId)
                let TempsBanList = getTempsBanList(_guildid, _userId)
                let TempsMuteList = getTempsMuteList(_guildid, _userId)
                let WarnList = getCasierWarnList(_guildid, _userId)


                for(i=0 ; i<banList.length ; i++){
                    let adminBanUser = client.users.cache.find(user => user.id === banList[i].admin)
                    banListFormate = banListFormate + "\n\`#" + (i+1) + "\`- " +  banList[i].reason + "\n ↪️ Par :  " + `${adminBanUser}`
                }

                for(i=0 ; i<TempsBanList.length ; i++){
                    let AdminTempsBanList = client.users.cache.find(user => user.id === TempsBanList[i].admin)
                    TempsbanListFormate = TempsbanListFormate + "\n\`#" + (i+1) + "\`- " +  TempsBanList[i].reason + "\n ↪️ Par :  " + `${AdminTempsBanList}`
                }

                for(i=0 ; i<TempsMuteList.length ; i++){
                    let AdminTempsMuteList = client.users.cache.find(user => user.id === TempsMuteList[i].admin)
                    TempsmuteListFormate = TempsmuteListFormate + "\n\`#" + (i+1) + "\`- " +  TempsMuteList[i].reason + "\n ↪️ Par :  " + `${AdminTempsMuteList}`
                }

                for(i=0 ; i<WarnList.length ; i++){
                    let AdminWarnList = client.users.cache.find(user => user.id === WarnList[i].admin)
                    warnListFormate = warnListFormate + "\n\`#" + (i+1) + "\`- " +  WarnList[i].reason + "\n ↪️ Par :  " + `${AdminWarnList}`
                }
                
                const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`📋 Casier de ${pseudo.member.user.username}`)
                .setDescription(`\`Nombre de Ban :\` **${getCasier(_guildid, pseudo.value).banCount}**\n${banListFormate}\n
                \`Nombre de TempsBan :\` **${getCasier(_guildid, pseudo.value).tempsBanCount}**\n${TempsbanListFormate}\n
                \`Nombre de TempsMute :\` **${getCasier(_guildid, pseudo.value).tempsMuteCount}**\n${TempsmuteListFormate}\n
                \`Nombre de Warn :\` **${getCasier(_guildid, pseudo.value).warnCount}**${warnListFormate}\n
                `)
               
             await interaction.reply({embeds: [embded5]})

                 
            }
        }

        if (interaction.commandName === 'warnremove') {

            if (interaction.member.permissions.has("ADMINISTRATOR")) {
                
                const reason = interaction.options.get('raison');
                const pseudo = interaction.options.get('pseudo')

                let _guildId = interaction.guildId
                let _userId = pseudo.value

                getWarnList(_guildId, _userId)
                WarnList[_guildId][_userId].pop(reason)
                fs.writeJSONSync("WarnList.json",  WarnList )

                getCasier(_guildId, _userId)
                Casier[_guildId][_userId].warnCount --
                fs.writeJSONSync("Casier.json",  Casier )

                getCasierWarnList( _guildId, _userId)
                CasierWarnList[_guildId][_userId].pop({
                    reason : reason,
                    admin : interaction.user.id
                })
                fs.writeJSONSync("CasierWarnList.json",  CasierWarnList )
                   
                const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`📋 Warn de ${pseudo.member.user.username}`)
                .setDescription(`Le dernier avertissement donné à ${pseudo.member.user.username} a été supprimé avec succès ! ✅`)
               
             await interaction.reply({embeds: [embded5]})

                 
            }
        }

    }
    
    catch (error) {
       console.log(error);
    }
})

client.on('guildMemberAdd', async member => {

    let _guildId = member.guild.id
    let _userId = member.user.id
    
    const tempsDeban = getTempsBan(_guildId, _userId)   
    if(Date.now() /1000 < tempsDeban){
       
        await member.guild.members.kick(member.user, {reason: "A essayé de rejoindre alors qu'il est Ban"});
        
    }
});

client.on('messageCreate', async message => {

    let _guildId = message.guild.id
    let _userId = message.author.id
    
    const tempsDemute = getTempsMute(_guildId, _userId)  
    if(Date.now() /1000 < tempsDemute){
        
        message.delete()
        message.author.send ("Tu es Mute tu ne peux pas parler ❌")       
      
    }

    if(message.author.bot === false){

        let _Xp = getXp(_guildId, _userId)
        Xp[_guildId][_userId] = _Xp + 5
        fs.writeJSONSync("Xp.json",  Xp )     
    }
    
    if(getXp(_guildId, _userId) == 10){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 2 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

    if(getXp(_guildId, _userId) == 25){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 3 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

    if(getXp(_guildId, _userId) == 50){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 3 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

    if(getXp(_guildId, _userId) == 100){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 4 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

    if(getXp(_guildId, _userId) == 150){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 5 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

    if(getXp(_guildId, _userId) == 200){

        const embded5 = new EmbedBuilder()
                .setColor(0x43EA57)
                .setTitle(`🎗️ Expérience `)
                .setDescription(`Félicitations ${message.member} tu passes niveau 6 ! ✨`)
               
             await message.reply({embeds: [embded5]})

    }

});

client.login(TOKEN);