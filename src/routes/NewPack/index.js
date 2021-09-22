import React from 'react'
import styles from './styles.module.scss'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { v4 as uuidv4 } from 'uuid'
import { useHistory } from 'react-router-dom'
import { saveLocalPack } from '../../localStorage/localPacks'
import dayjs from 'dayjs'

export default function NewPack() {
  const [packName, setPackName] = React.useState('')
  const history = useHistory()

  const createPack = async () => {
    const uuid = uuidv4()
    const pack = {
      uuid,
      name: packName,
      date: dayjs().format('DD.MM.YYYY'),
      creationTime: Date.now(),
      language: 'ru-RU',
      difficulty: 5
    }
    await saveLocalPack(pack)
    history.push(`/pack/${uuid}`)
  }

  const examples = ['Вопросы от славян', 'Игры, музыка и многое другое', 'Кинопак', 'Аниме и прочий буллщит', 'Мемная Солянка']

  return (
    <div className={styles.container}>
      <TextField
        label='Название пака'
        variant='outlined'
        value={packName}
        onChange={e => setPackName(e.target.value)}
        className={styles.field}
        placeholder={examples[Math.floor(Math.random()*examples.length)]}
      />
      <Button
        variant='contained'
        onClick={() => createPack()}
        disabled={!packName.length}
      >Создать</Button>
    </div>
  )
}
