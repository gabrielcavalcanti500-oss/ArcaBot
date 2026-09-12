
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const qrcode = require("qrcode-terminal");
const menuPrincipal = require("./menus/principal");
const aviamentos = require("./menus/aviamentos");
const artesanato = require("./menus/artesanato");
const papelaria = require("./menus/papelaria");
const eletronicos = require("./menus/eletronicos");
const brinquedos = require("./menus/brinquedos");
const impressao = require("./menus/impressao");
const recargas = require("./menus/recargas");
const horario = require("./menus/horario");
const produtos = require("./config/produtos");
const procurarCategoria = require("./utils/procurarCategoria");

async function startBot() {

    const { state, saveCreds } = await useMultiFileAuthState("auth");

    const sock = makeWASocket({
        auth: state
    });

    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("connection.update", ({ connection, qr }) => {

        if (qr) {
            console.log("📲 Escaneie o QR abaixo:");
            qrcode.generate(qr, { small: true });
        }

        if (connection === "open") {
            console.log("✅ Bot conectado com sucesso!");
        }

        if (connection === "close") {
            console.log("❌ Conexão fechada. Reconectando...");
            startBot();
        }

    });

    sock.ev.on("messages.upsert", async ({ messages, type }) => {

        // Responde apenas mensagens novas
        if (type !== "notify") return;

        const mensagem = messages[0];

        if (!mensagem.message) return;

        // Ignora mensagens enviadas pelo próprio bot
        if (mensagem.key.fromMe) return;

        const texto =
            mensagem.message.conversation ||
            mensagem.message.extendedTextMessage?.text;

        if (!texto) return;

        const remetente = mensagem.key.remoteJid;
        const msgLower = texto.trim().toLowerCase();
        const categoria = procurarCategoria(msgLower);

        console.log("📩", mensagem.pushName, "->", texto);

        // =========================
        // MENU PRINCIPAL
        // =========================

        if (encontrouPalavra(msgLower, produtos.eletronicos)) {
    await sock.sendMessage(remetente, {
        text: eletronicos
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.papelaria)) {
    await sock.sendMessage(remetente, {
        text: papelaria
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.artesanato)) {
    await sock.sendMessage(remetente, {
        text: artesanato
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.aviamentos)) {
    await sock.sendMessage(remetente, {
        text: aviamentos
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.brinquedos)) {
    await sock.sendMessage(remetente, {
        text: brinquedos
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.impressao)) {
    await sock.sendMessage(remetente, {
        text: impressao
    });
    return;
}

if (encontrouPalavra(msgLower, produtos.recargas)) {
    await sock.sendMessage(remetente, {
        text: recargas
    });
    return;
}

if (categoria) {

    const menus = {
        aviamentos,
        artesanato,
        papelaria,
        eletronicos,
        impressao,
        recargas,
        brinquedos
    };

    await sock.sendMessage(remetente, {
        text: menus[categoria]
    });

    return;
}
    
        switch (msgLower) {

case "oi":
case "olá":
case "ola":
case "bom dia":
case "boa tarde":
case "boa noite":
case "menu":
case "0":
case "inicio":
case "início":
case "começar":
case "comecar":
case "?":

        await sock.sendMessage(remetente, {
            text: menuPrincipal
        });
        break;

    case "1":

        await sock.sendMessage(remetente, {
            text: aviamentos
        });
        break;

    case "2":

        await sock.sendMessage(remetente, {
            text: artesanato
        });
        break;

    case "3":

        await sock.sendMessage(remetente, {
            text: papelaria
        });
        break;

    case "4":

        await sock.sendMessage(remetente, {
            text: eletronicos
        });
        break;

    case "5":

        await sock.sendMessage(remetente, {
            text: impressao
        });
        break;

    case "6":

        await sock.sendMessage(remetente, {
            text: recargas
        });
        break;

    case "7":

        await sock.sendMessage(remetente, {
            text: brinquedos
        });
        break;

    case "8":

        await sock.sendMessage(remetente, {
            text: horario
        });
        break;

    case "9":

        await sock.sendMessage(remetente, {
            text: "👨‍💼 Certo! Em instantes um atendente responderá sua mensagem."
        });
        break;

       default:

        await sock.sendMessage(remetente, {
            text: "❓ Não entendi sua mensagem.\n\nDigite *0* ou *menu* para ver as opções disponíveis."
        });

        break;
}

    });

}

function encontrouPalavra(texto, lista) {
    return lista.some(item => texto.includes(item));
}

startBot();