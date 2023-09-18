import { Request, Response } from 'express';
import friends from '../models/friends';





export const getFriends = (req: Request, res: Response) => {


    return friends.find({})
      .then((friends) => { res.status(200).send({ data: friends }) })
      .catch(() => { res.status(500).send({ message: "Server Error" })})
}




export const getFriend = (req: Request, res: Response) => {

  const { friend } = req.body;
  return friends.findOne({ friend: friend  })
    .then((friends) => { res.status(200).send({ data: friends }) })
    .catch(() => { res.status(500).send({ message: "Server Error" })})

}