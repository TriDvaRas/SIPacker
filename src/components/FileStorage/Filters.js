import React from 'react'
import PropTypes from 'prop-types'
import styles from './styles.module.scss'
import { MdFilterList, MdDelete } from 'react-icons/md'
import Stack from '@mui/material/Stack'
import FormControlLabel from '@mui/material/FormControlLabel'
import Checkbox from '@mui/material/Checkbox'
import Typography from '@mui/material/Typography'
import { ContextMenuActions } from 'components/ContextMenu'
import { deleteFilesOfPack } from 'localStorage/fileStorage'

Filters.propTypes = {
  packs: PropTypes.arrayOf(PropTypes.string),
  checkboxes: PropTypes.arrayOf(PropTypes.bool),
  onChange: PropTypes.func,
  reloadPacks: PropTypes.func
}

export default function Filters(props) {
  const contextMenuActions = React.useContext(ContextMenuActions)

  const handleChange = (e, i) => {
    const checkboxes = [...props.checkboxes]
    checkboxes[i] = { ...checkboxes[i], checked: e.target.checked }
    props.onChange(checkboxes)
  }

  const handleOpenMenu = uuid => e => {
    contextMenuActions.open(
      e,
      [
        {
          name: 'Удалить',
          icon: <MdDelete />,
          action: async () => {
            await deleteFilesOfPack(uuid)
            props.reloadPacks()
          }
        }
      ]
    )
  }

  return (
    <Stack className={styles.filters}>
      <div className={styles.text}>
        <MdFilterList />
        <Typography variant='overline' color='text.secondary'>
          Фильтры
        </Typography>
      </div>
      {props.packs.map((pack, i) =>
        <FormControlLabel
          key={i}
          control={
            <Checkbox
              checked={Boolean(props.checkboxes[i]?.checked)}
              onChange={e => handleChange(e, i)}
            />
          }
          className={styles.checkbox}
          label={pack === null ? 'Удаленные паки' : pack.name}
          onContextMenu={handleOpenMenu(pack === null ? null : pack.uuid)}
        />
      )}
    </Stack>
  )
}
