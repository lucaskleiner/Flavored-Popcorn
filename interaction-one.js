const mysql = require('mysql');

const dbConfig = {
  host: 'localhost',
  user: 'dbuser',
  password: 'dbpassword',
  database: 'site'
};

function Interaction() {
  const accessToken = 'TOKEN_DE_AUTENTICAÇÃO';
  const recipientId = 'ID_DO_PERFIL_DE_DESTINO';
  const message = 'Olá, podemos ajudar com algo mais?';
  const requestObj = {
    recipient: {
      id: recipientId
    },
    message: {
      text: message
    }
  };

  fetch(`https://graph.facebook.com/v15.0/me?fields=email&access_token=${accessToken}`)
    .then(response => response.json())
    .then(data => {
      const userEmail = data.email;
      const connection = mysql.createConnection(dbConfig);
      connection.connect();
      const query = `INSERT INTO usuarios (email) VALUES ('${userEmail}')`;
      connection.query(query, (error, results) => {
        if (error) {
          console.error('Erro ao salvar o e-mail no banco de dados:', error);
        } else {
          console.log('E-mail salvo com sucesso no banco de dados!');
        }
        connection.end();
      });

      return fetch(`https://graph.facebook.com/v15.0/me/messages?access_token=${accessToken}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObj)
      });
    })
    .then(response => {
      console.log('Mensagem enviada com sucesso!');
    })
    .catch(error => {
      console.error('Erro ao enviar mensagem:', error);
    });
}

window.addEventListener('beforeunload', Interaction);
