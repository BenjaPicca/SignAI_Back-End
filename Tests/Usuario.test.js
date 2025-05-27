import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../index.js'





it('Tiene que devolver 404 cuando faltan campos por completar', async () => {
    const res = await request(app)
      .post('/usuario/login')
      .send({ mail: 'a@gmail.com' }); // FALTA contraseña

    
    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Tienen que estar todos los campos completados.');
  });

