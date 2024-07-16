const request = require('supertest');
const { faker } = require('@faker-js/faker');

const {
    URLS,
    HEADERS
} = require('../suporte/configEnv')

describe('Suite de testes CRUD (post, get, put, delete)', () => {

    beforeAll(async() => {
        const payloadUsuario = {
            nome: faker.person.fullName(),
            telefone: faker.phone.number('+55 (##) ####-####'),
            email: faker.internet.email(),
            senha: faker.internet.password()
        }

        const response = await request(URLS.BASE_URL)
            .post(URLS.ENDPOINT_USERS)
            .send(payloadUsuario);

        idUsuario = response.body.id;
        emailUsuario = response.body.email;

        expect(response.status).toBe(201); 

        console.log("Usuário cadastrado:", response.body);
    }) 

    const payloadUsuarioDadosVazios = {
        nome: "",
        telefone: "",
        email: "",
        senha: ""
    }

    let idUsuario = '';
    let emailUsuario = '';
    
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

});