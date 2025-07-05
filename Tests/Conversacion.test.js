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
    .get('/conversacion/getFeedback/28')
    .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6InNlYW5AZ21haWwuY29tIiwiaWF0IjoxNzQ2ODA5NzMwLCJleHAiOjM1NDY4MDk3MzB9.vb-cUiVv0Ttsel9vhMWsN8kcLOddABTETaUX1ze_YfM')

    console.log(res.status)
    expect(res.status).to.equal(200)
})