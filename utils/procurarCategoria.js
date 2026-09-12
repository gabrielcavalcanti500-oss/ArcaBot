const produtos = require("../config/produtos");

function procurarCategoria(texto) {

    for (const categoria in produtos) {

        const palavras = produtos[categoria];

        const encontrou = palavras.some(palavra =>
            texto.includes(palavra)
        );

        if (encontrou) {
            return categoria;
        }

    }

    return null;

}

module.exports = procurarCategoria;