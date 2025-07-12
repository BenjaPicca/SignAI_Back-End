import request from 'supertest';
import { expect } from 'chai';
import sinon from 'sinon';
import app from '../index.js'

//Select Feed
it('Tiene que devolver que devolver 404 si no hay ningún id, (Fed)', async()=>{
    const res= await request(app)
    .get('/conversacion/getFeedback/')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(404)

})


it('Tiene que devolver 200 si la seleccion es exitosa, (Fed)', async()=>{
    const res = await request(app)
    .get('/conversacion/getFeedback/5')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(200)
})  

it('Tiene que devolver 404 si el ID ingresado no existea,(Fed)', async()=>{
    const res= await request(app)
    .get('/conversacion/getFeedback/')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(404)
})

//Insert Feed

it('Tiene que devolver 404 si no hay ningún Mail ingrsado, (InsFeed)', async()=>{
    const res= await request(app)
    .post('/conversacion/CrearFeedback')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')
    .send({feedback: "godiiini",
        mailusuario: ""})

    console.log(res.status)
    expect(res.status).to.equal(404)
})

it('Tiene que devolver 200 si se inserta correctamente, (InsFeed)', async()=>{
    const res = await request(app)
    .post('/conversacion/CrearFeedback')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')
    .send({feedback: "godiiini",
        mailusuario: "sean@gmail.com"})

    console.log(res.status)
    expect(res.status).to.equal(200)
})
//Eliminar Conver
it('Tiene que devolver 404 si no hay ningún id, (Del)', async()=>{
    const res = await request(app)
    .delete('/conversacion/EliminarConver/')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(404)
})
it('Tiene que devolver 200 si se elimina exitosamente, (DelConver)',async()=>{
    const res = await request(app)
    .delete('/conversacion/EliminarConver/191')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(200)
})

//UpdateFeed

it('Tiene que devolver 404 si id ingresado no existe, (UpdFeed)', async()=>{
    const res = await request(app)
    .put('/conversacion/192/UpdateFeed')
    .send({Feedback:"mimammm"})
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('Id ingresado no existe')
})
it('Tiene que devolver 404 si no hay ingresado o feed o id, (UpdFeed)', async()=>{
    const res = await request(app)
    .put('/conversacion/197/UpdateFeed')
    .send({Feedback:''})
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(404)
    expect(res.body.message).to.equal('No hay ningún Id o ningún feed')
})