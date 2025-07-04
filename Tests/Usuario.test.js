import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../index.js'




//Log In
it('Tiene que devolver 404 cuando faltan campos por completar', async () => {
    const res = await request(app)
      .post('/usuario/login')
      .send({ mail: 'a@gmail.com' }); 

    
    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Tienen que estar todos los campos completados.');
  });

it('Tiene que devolver 400 si el Mail no está asociado',  (done)=> {
    request(app)
    .post('/usuario/login')
    .send({ mail: 'asadaas@gmail.com', contraseña: "123" })
    .end((err, res) => {
      if (err) return done(err);
        console.log(res.status)
        expect(res.status).to.equal(400);
        expect(res.body.message).to.equal("No hay un usuario asociado a ese mail");
        done()
      
    })
  })


it('Tiene que devolver 401 si la contraseña esta mal', async()=>{
  const res = await request(app)
    .post('/usuario/login')
    .send({mail:'HOLA@gmail.com',contraseña:'HOLIS'})

    console.log(res.status)
    expect(res.status).to.equal(401)
    expect(res.body.message).to.equal('Contraseña incorrecta')
})
//HAY QUE CAMBIAR SECRETS
it('Tiene que devolver 200 si el usuario Inicia sesión exitosamente', async ()=>{
  const res= await request(app)
    .post('/usuario/login')
    .send({mail:'HOLA@gmail.com',contraseña:'HOLA'})

    console.log(res.status)
    expect(res.status).to.equal(200)
})

// InsertarUsuario


it('Tiene que devolver 404 si faltan campos por completar',async()=>{
  const res= await request(app)
    .post('/usuario/insertar')
    .send({nombre: "LULALEVY",
    mail: "LULALEVY@gmail.com",
    admin: true})

    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Todos los campos tienen que estar completos')
  })

it('Tiene que devolver 200 si el cliente se registra exitosamente', async ()=>{
  const res= await request(app)
    .post('/usuario/insertar')
    .send({nombre: "TARTA",
    mail: "TARTA@gmail.com",
    contraseña:"TARTA",
    admin: true})

    console.log(res.status)
    expect(res.status).to.equal(200)
    expect(res.body.message).to.equal('Se ha insertado Correctamente')
})

//Select Usuario

it('Tiene que devolver 400 si no hay ningún mail', async ()=>{
    const res = await request(app)
      .get('/usuario/Selector/')

      console.log(res.status)
      expect(res.status).to.equal(400)
      expect(res.body.message).to.equal('No hay ningún Mail')
})
it('Tiene que devolver 404 si no existe Mail', async ()=>{
  const res = await request(app)
    .get('/usuario/Selector/asassa')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM');

    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Mail ingresado no existente')
})

it('Tiene que devolver 200 si se selecciona el Mail correctamente', async()=>{
  const res = await request(app)
    .get('/usuario/Selector/p@gmail.com')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM');

    console.log(res.status)
    expect(res.status).to.equal(200)
    
})

//Delete usuario

it('Tiene que devolver 404 si el mail ingresado no existe',   (done) =>{
  request(app)
  .delete('/usuario/delUsuario/a@hotmail.con')
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')
  .end((err, res) => {
      if (err) return done(err);

    console.log(res.status,"asa")
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('El mail ingreseado no existe');
    done();
  })
})

it('Tiene que devolver 401 si no hay ningún Token ingresado', async ()=>{
  const res = await request(app)
  .delete('/usuario/delUsuario/a@hotmail.con')

  console.log(res.status,"asa")
  expect(res.status).to.equal(401)
})

it('Tiene que devolver 404 si no hay ningún Mail para Eliminar', async()=>{
  const res= await request(app)
  .delete('/usuario/delUsuario/')
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM');

  expect(res.status).to.equal(404)
})
it('tiene que devolver 200 si el Usuario se elimina exitosamente', async()=>{
  const res= await request(app)
  .delete('/usuario/delUsuario/ECHU9v@gmail.com')
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM');

  console.log(res.status)
  expect(res.status).to.equal(200)
  
})

//Update Usuario

it('Tiene que devolver 404 si no hay ningún Mail ingresado,(Upd)', async()=>{
  const res = await request(app)
  .put('/usuario/Update')
  .send({mail:''})
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

  console.log(res.status)
  expect(res.status).to.equal(404)
})

it('Tiene que devolver 404 si el Mail ingresado no existe,(Upd)', async()=>{
  const res = await request(app)
  .put('/usuario/Update')
  .send({nombreusuario: " sean",
  mail: "jmnb@gmail.com",
  contraseña:"sean",
  admin: true})
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

  console.log(res.status)
  expect(res.status).to.equal(404)
  expect(res.body.message).to.equal("El mail ingreseado no existe")

})

it('Tiene que devolver 200 si el mail ingresado existe y se actualiza correctamente, (Upd)', async()=>{
  const res= await request(app)
  .put('/usuario/Update')
  .send({nombreusuario: " LENCG",
  mail: "LENTES@gmail.com",
  contraseña:"LENCG",
  admin: true})
  .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

  console.log(res.status)
  expect(res.status).to.equal(200)
  
})

