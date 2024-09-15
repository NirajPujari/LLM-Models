import { StaticImageData } from 'next/image';
import placeHolder from '../assets/placeHolder/placeHolder.png'

type memberT = {
  name: string;
  image: StaticImageData;
}

export const Members: memberT[] = [
  { name: "Niraj Pujari", image: placeHolder },
  { name: "Akshay Nair", image: placeHolder },
  { name: "Trupti Sarang", image: placeHolder },
  { name: "Arjun Punna", image: placeHolder },
  { name: "Swaraj Patil", image: placeHolder },
] 