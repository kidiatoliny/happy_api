import {Request, Response} from 'express'
import { getRepository } from 'typeorm'
import Orphanages from '../models/Orphanages'
import orphanageView from '../views/orphanages.view'

export default {

  /** get all orphanages */
  async index(request: Request, response: Response){
    const orphanagesRepository = getRepository(Orphanages)
    const orphanages = await orphanagesRepository.find({
      relations:['images']
    })

    return response.json(orphanageView.renderMany(orphanages))
  },

  /** get one orphanage */
  async show(request: Request, response: Response){
    const { id } = request.params

    const orphanagesRepository = getRepository(Orphanages)
    const orphanage = await orphanagesRepository.findOneOrFail(id,{
      relations:['images']
    })

    return response.json(orphanageView.render(orphanage))
  },


  /** create orphanage */
  async create(request:Request , response:Response){

  const {
    name,
    latitude,
    longitude,
    about,
    instructions,
    opening_hours,
    open_on_weekends
  }=request.body

  const orphanagesRepository = getRepository(Orphanages)
  const requestImages = request.files as Express.Multer.File[];

  const images = requestImages.map(image=>{
    return{
      path: image.filename
    }
  })

  const orphanages = orphanagesRepository.create({
    name,
    latitude,
    longitude,
    about,
    instructions,
    opening_hours,
    open_on_weekends,
    images
  })

  await orphanagesRepository.save(orphanages)

  return response.status(201)
    .json(orphanages)
  }




}