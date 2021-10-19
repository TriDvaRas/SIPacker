import React from 'react'
import styles from './styles.module.scss'
import PropTypes from 'prop-types'
import { componentsPropTypes } from '../../consts.js'
import { Create, Upload, Loading, Pack } from './packTypes'
import { Link } from 'react-router-dom'
import { loadLocalPacks } from '../../localStorage/localPacks'
import { connect } from 'react-redux'

export default function Dashboard() {
  return (
    <LocalPacks />
  )
}

export const DashboardContext = React.createContext({})
export const LocalPacks = connect(state => ({ dashboard: state.dashboard }))(props => {
  const [savedLocalPacks, setSavedLocalPacks] = React.useState()

  const loadPacks = async () => {
    const packsUUID = await loadLocalPacks()
    const packs = packsUUID
      .sort((a,b) => a.creationTime - b.creationTime)
    setSavedLocalPacks(packs)
  }

  React.useEffect(() => loadPacks(), [])

  const contextActions = {
    reloadPacks: () => loadPacks()
  }

  return (
    <div>
      <DashboardContext.Provider value={contextActions}>
        <div className={styles.packsList}>
          <PackBase type='create' />
          <PackBase type='upload' reloadPacks={loadPacks} />
          { props.dashboard?.uploading?.reverse().map(({ name }, i) => <PackBase type='loading' name={name} key={i} />) }
          { savedLocalPacks
            ? savedLocalPacks.map(pack => <PackBase type='pack' key={pack.uuid} pack={pack} />)
            : new Array(5).fill().map((_, i) => <PackBase type='loading' key={i} />)
          }
        </div>
      </DashboardContext.Provider>
    </div>
  )
})

PackBase.propTypes = PackSwitch.propTypes = {
  type: PropTypes.oneOf(['create', 'upload', 'pack', 'loading']),
  pack: PropTypes.shape(componentsPropTypes.pack),
  name: PropTypes.string,
  reloadPacks: PropTypes.func
}

function PackBase(props) {
  return (
    ['loading', 'upload'].includes(props.type)
      ? <PackSwitch {...props} />
      : <Link to={props.type === 'pack' ? `/pack/${props.pack.uuid}` : `${props.type}`}><PackSwitch {...props} /></Link>
  )
}

function PackSwitch(props) {
  return (
    {
      'create': <Create />,
      'upload': <Upload reloadPacks={props.reloadPacks} />,
      'loading': <Loading name={props.name} />,
      'pack': <Pack pack={props.pack} />
    }[props.type]
  )
}