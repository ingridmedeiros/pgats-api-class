const request = require('supertest');
const { faker } = require('@faker-js/faker');

const {
    URLS,
    HEADERS
} = require('../suporte/configEnv')

describe('Suite de testes CRUD (post, get, put, delete)', () => {
    const payloadUsuario = {
        nome: faker.person.fullName(),
        telefone: faker.phone.number('+55 (##) ####-####'),
        email: faker.internet.email(),
        senha: faker.internet.password()
    }

    const payloadUsuarioDadosVazios = {
        nome: "",
        telefone: "",
        email: "",
        senha: ""
    }

    let idUsuario = '';
    let emailUsuario = '';

    it('Deve retornar mensagem de campos obrigatorios. Deve retornar status 422', async()=> {
        const response = await request(URLS.BASE_URL)
            .post(URLS.ENDPOINT_USERS)
            .send(payloadUsuarioDadosVazios);
            
        expect(response.status).toBe(422);
       // expect(response.body.error).toEqual("Os seguintes campos são obrigatórios: nome, telefone, email, senha");
        expect(response.body).toEqual({ error: "Os seguintes campos são obrigatórios: nome, telefone, email, senha" });
    
        console.log(response.body.error);
    });

    it('Cadastrando um usuário, e consultando o retorno dos campos, se foram enviados.', async()=>{
        const response = await request(URLS.BASE_URL)
            .post(URLS.ENDPOINT_USERS)
            .send(payloadUsuario);

            //validacao do status code
            expect(response.status).toBe(201); 
            console.log(response.body);

            //validar dados retornados. verificar se o que estou enviando é o que estou recebendo. preciso declarar da onde 
            //os objs escritos precisam está na mesma ordem do payoad do sistema
            const{id, nome, telefone, email} = response.body

            //verifica a presença do ID
            expect(id).toBeDefined();

            //verifica valor enviado x persistido (recebido)
            expect(nome).toBe(payloadUsuario.nome);
            expect(telefone).toBe(payloadUsuario.telefone);
            expect(email).toBe(payloadUsuario.email);

            //verificar que a senha não está presente no retorno
            expect(response.body.senha).toBeUndefined();
            console.log('Cadastro do usuário randomico', response.body);
            idUsuario = response.body.id;
            emailUsuario = response.body.email;

    });
    
    it('Deve alterar o registro cadastrado anteriormente e verificar se houve alteração. Deve retornar status 201', async()=> {
        const payloadUsuarioAlteracao = {
            "nome": faker.person.fullName(),
            "telefone": faker.phone.number('+55 (##) ####-####'),
            "senha":faker.internet.password(),
            "email": emailUsuario
        }

        const response = await request(URLS.BASE_URL)
            .put(URLS.ENDPOINT_USERS +"/"+ idUsuario)
            .send(payloadUsuarioAlteracao);

        expect(response.status).toBe(201);

        //Validar se o conteúdo foi alterado
        const{id, nome, telefone, email} = response.body
        expect(nome).toBe(payloadUsuarioAlteracao.nome);
        expect(telefone).toBe(payloadUsuarioAlteracao.telefone);
        expect(email).toBe(payloadUsuarioAlteracao.email);

        console.log("Usuário Alterado: ", response.body);
        
    });

    it('Deve remover o registro cadastrado anteriomente. Deve retornar status 201', async()=> {
        const response = await request(URLS.BASE_URL)
            .delete(URLS.ENDPOINT_USERS +"/"+ idUsuario);

        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
        console.log('Resposta do delete: ', request.body);

        const responseGet = await request(URLS.BASE_URL)
            .get(URLS.ENDPOINT_USERS +"/"+ idUsuario);

        expect(responseGet.status).toBe(404);
        expect(responseGet.body.error).toEqual("Usuário não encontrado");

    });

    it('Deve retornar Usuário não encontrado', async()=> {
        const responseGet = await request(URLS.BASE_URL)
            .get(URLS.ENDPOINT_USERS +"/"+ idUsuario);

        expect(responseGet.status).toBe(404);
        expect(responseGet.body.error).toEqual("Usuário não encontrado");

    });
});