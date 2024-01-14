import Whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';
import vCard from 'vcf';
import fs from 'fs';

const { Client, LocalAuth } = Whatsapp;
const client = new Client({
    authStrategy: new LocalAuth()
});

client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
    console.log('Client is ready!');
    client.getChats().then(chats => {
        chats.forEach(chat => {
            if (chat.isGroup) {
                const vcards = [];
                console.log('Group: ' + chat.name);
                chat.participants.forEach(contact => {
                    let vCardInstance = new vCard();
                    vCardInstance.add('n', contact.name);
                    vCardInstance.add('tel', contact.id.user);
                    vcards.push(vCardInstance); 
                });
                fs.writeFile(chat.name + '.vcf', vcards.join("\n\n"), function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    console.log("The file was saved!");
                });
            }
        });
    });
});

client.initialize();
