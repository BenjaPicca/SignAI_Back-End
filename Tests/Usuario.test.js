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

it('Tiene que devolver 400 el mail ingresado no esta asociado', async()=>{
  const res= await request(app)
    .post('/usuario/login')
    .send({mail:'asadaas@gmail,com',contraseña: "123"});

    console.log(res.status)
    expect(res.status).to.equal(400)
    expect(res.body.message).to.equal("No hay un usuario asociado a ese mail")
    
  })

it('Tiene que devolver 401 si la contraseña esta mal', async()=>{
  const res = await request(app)
    .post('usuario/login')
    .send({mail:'benjapiccagl@gmail.com',contraseña:'NASHE'})

    console.log(res.status)
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('"Contraseña incorrecta"')
})