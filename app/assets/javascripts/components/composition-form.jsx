import AllowDuplicatesCheckbox from './allow-duplicates-checkbox.jsx'
import CompositionFormHeader from './composition-form-header.jsx'
import CompositionNotes from './composition-notes.jsx'
import EditPlayerSelectionRow from './edit-player-selection-row.jsx'
import MapSegmentHeader from './map-segment-header.jsx'
import PlayerEditModal from './player-edit-modal.jsx'

import OverwatchTeamCompsApi from '../models/overwatch-team-comps-api'

export default class CompositionForm extends React.Component {
  constructor() {
    super()
    this.state = {
      id: null,
      name: '',
      slug: '',
      mapID: null,
      mapSlug: '',
      mapImage: null,
      mapSegments: [],
      players: [],
      availablePlayers: [],
      heroes: {},
      selections: {},
      duplicatePicks: {},
      notes: '',
      editingPlayerID: null,
      isRequestOut: false,
      allowDuplicates: false
    }
  }

  componentDidMount() {
    this.loadComposition()
  }

  onCompositionFetchError(error) {
    console.error('failed to load composition data for form', error)
    this.setState({ isRequestOut: false })
  }

  onCompositionSaveError(error) {
    console.error('failed to save composition', error)
    this.setState({ isRequestOut: false })
  }

  onMapChange(mapID) {
    this.loadComposition(mapID)
  }

  onPlayerCreationError(error) {
    console.error('failed to create player', error)
    this.setState({ isRequestOut: false })
  }

  onCompositionNameChange(name, create) {
    const { id, mapID } = this.state
    const api = new OverwatchTeamCompsApi()

    const body = {
      name,
      map_id: mapID
    }
    if (id && !create) {
      body.composition_id = id
    }

    this.setState({ isRequestOut: true }, () => {
      api.saveComposition(body).
        then(newComp => this.onCompositionLoaded(newComp)).
        catch(err => this.onCompositionSaveError(err))
    })
  }

  onCompositionNotesChange(notes) {
    const { id, mapID } = this.state
    const api = new OverwatchTeamCompsApi()

    const body = {
      notes,
      map_id: mapID
    }
    if (id) {
      body.composition_id = id
    }

    this.setState({ isRequestOut: true }, () => {
      api.saveComposition(body).
        then(newComp => this.onCompositionLoaded(newComp)).
        catch(err => this.onCompositionSaveError(err))
    })
  }

  onPlayerSelected(playerID, playerName, position) {
    if (playerID) {
      this.updatePlayer(playerID, position)
    } else {
      this.createPlayer(playerName, position)
    }
  }

  onHeroSelectedForPlayer(heroID, mapSegmentID, playerID, position) {
    const { id } = this.state
    const api = new OverwatchTeamCompsApi()

    const body = {
      hero_id: heroID,
      map_segment_id: mapSegmentID,
      player_id: playerID,
      player_position: position
    }
    if (id) {
      body.composition_id = id
    }

    this.setState({ isRequestOut: true }, () => {
      api.saveComposition(body).
        then(newComp => this.onCompositionLoaded(newComp)).
        catch(err => this.onCompositionSaveError(err))
    })
  }

  onCompositionLoaded(composition) {
    this.setState({
      isRequestOut: false,
      id: composition.id,
      name: composition.name,
      slug: composition.slug,
      mapID: composition.map.id,
      mapSlug: composition.map.slug,
      mapImage: composition.map.image,
      mapSegments: composition.map.segments,
      players: composition.players,
      availablePlayers: composition.availablePlayers,
      heroes: composition.heroes,
      selections: composition.selections,
      duplicatePicks: composition.duplicatePicks,
      notes: composition.notes,
      allowDuplicates: composition.allowDuplicates
    })
  }

  // Returns a list of players. Includes only players not selected in
  // other rows. Always includes the given player.
  getPlayerOptionsForRow(playerForRow) {
    const { availablePlayers, players } = this.state
    const playerIDsInComp = players.map(player => player.id)
    return availablePlayers.filter(player =>
      playerIDsInComp.indexOf(player.id) < 0 || player.id === playerForRow.id
    )
  }

  getPlayerToEdit() {
    const { players, editingPlayerID } = this.state

    if (typeof editingPlayerID === 'number') {
      return players.filter(player => player.id === editingPlayerID)[0]
    }

    return null
  }

  changeAllowDuplicates(allow) {
    const { id, mapID } = this.state
    const api = new OverwatchTeamCompsApi()

    const body = {
      map_id: mapID,
      allow_duplicates: allow
    }
    if (id) {
      body.composition_id = id
    }

    this.setState({ isRequestOut: true }, () => {
      api.saveComposition(body).
        then(newComp => this.onCompositionLoaded(newComp)).
        catch(err => this.onCompositionSaveError(err))
    })
  }

  loadComposition(mapID) {
    const api = new OverwatchTeamCompsApi()

    this.setState({ isRequestOut: true }, () => {
      api.getLastComposition(mapID).
        then(comp => this.onCompositionLoaded(comp)).
        catch(err => this.onCompositionFetchError(err))
    })
  }

  loadCompositionBySlug(slug) {
    const api = new OverwatchTeamCompsApi()

    this.setState({ isRequestOut: true }, () => {
      api.getComposition(slug).
        then(comp => this.onCompositionLoaded(comp)).
        catch(err => this.onCompositionFetchError(err))
    })
  }

  createPlayer(playerName, position) {
    const { id, mapID } = this.state
    const body = {
      name: playerName,
      composition_id: id,
      map_id: mapID,
      position
    }
    const api = new OverwatchTeamCompsApi()

    this.setState({ isRequestOut: true }, () => {
      api.createPlayer(body).
        then(comp => this.onCompositionLoaded(comp)).
        catch(err => this.onPlayerCreationError(err))
    })
  }

  updatePlayer(playerID, position) {
    const { mapID, id } = this.state
    const body = {
      map_id: mapID,
      player_position: position,
      player_id: playerID,
      composition_id: id
    }
    const api = new OverwatchTeamCompsApi()

    this.setState({ isRequestOut: true }, () => {
      api.saveComposition(body).
        then(newComp => this.onCompositionLoaded(newComp)).
        catch(err => this.onCompositionSaveError(err))
    })
  }

  editPlayer(playerID) {
    this.setState({ editingPlayerID: playerID })
  }

  closePlayerEditModal(newComposition) {
    this.editPlayer(null)
    if (newComposition) {
      this.onCompositionLoaded(newComposition)
    }
  }

  selectedPlayerCount() {
    return this.state.players.
      filter(p => typeof p.id === 'number').length
  }

  render() {
    const { name, slug, mapID, mapSegments, players, heroes,
            selections, notes, mapSlug, editingPlayerID, id,
            isRequestOut, mapImage, duplicatePicks,
            allowDuplicates } = this.state

    if (typeof mapID !== 'number') {
      return <p className="container">Loading...</p>
    }

    const editingPlayer = this.getPlayerToEdit()

    return (
      <form className="composition-form">
        <CompositionFormHeader
          compositionName={name}
          compositionSlug={slug}
          mapID={mapID}
          mapSlug={mapSlug}
          mapImage={mapImage}
          disabled={isRequestOut}
          onCompositionNameChange={(newName, create) =>
            this.onCompositionNameChange(newName, create)
          }
          onCompositionLoad={slugToLoad =>
            this.loadCompositionBySlug(slugToLoad)
          }
          onMapChange={newMapID => this.onMapChange(newMapID)}
        />
        <div className="container">
          <table className="players-table">
            <thead>
              <tr>
                <th className="players-header small-fat-header">
                  <span className="player-count">
                    {this.selectedPlayerCount()} / 6
                  </span>
                  Team
                </th>
                {mapSegments.map((segment, i) => (
                  <MapSegmentHeader
                    key={segment.id}
                    name={segment.name}
                    filled={segment.filled}
                    isAttack={segment.isAttack}
                    isFirstOfKind={segment.isFirstOfKind}
                    isLastOfKind={segment.isLastOfKind}
                    index={i}
                  />
                ))}
              </tr>
            </thead>
            <tbody>
              {players.map((player, index) => {
                const inputID = `player_${index}_name`
                const key = `${player.name}${index}`
                const playerHeroes = typeof player.id === 'number' ? heroes[player.id] : []
                const playerSelections = typeof player.id === 'number' ? selections[player.id] : {}
                const playerDupes = typeof player.id === 'number' ? duplicatePicks[player.id] : {}
                const selectablePlayers = this.getPlayerOptionsForRow(player)

                return (
                  <EditPlayerSelectionRow
                    key={key}
                    inputID={inputID}
                    playerID={player.id}
                    disabled={isRequestOut}
                    players={selectablePlayers}
                    heroes={playerHeroes}
                    selections={playerSelections}
                    duplicatePicks={playerDupes || {}}
                    mapSegments={mapSegments}
                    nameLabel={String(index + 1)}
                    onHeroSelection={(heroID, mapSegmentID) =>
                      this.onHeroSelectedForPlayer(heroID, mapSegmentID, player.id, index)
                    }
                    onPlayerSelection={(playerID, newName) =>
                      this.onPlayerSelected(playerID, newName, index)
                    }
                    editPlayer={playerID => this.editPlayer(playerID)}
                  />
                )
              })}
              <tr>
                <td colSpan={mapSegments.length + 1}>
                  <AllowDuplicatesCheckbox
                    onChange={allow => this.changeAllowDuplicates(allow)}
                    checked={allowDuplicates}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <CompositionNotes
            notes={notes}
            isRequestOut={isRequestOut}
            saveNotes={n => this.onCompositionNotesChange(n)}
          />
        </div>
        <PlayerEditModal
          playerID={editingPlayerID}
          playerName={editingPlayer ? editingPlayer.name : ''}
          battletag={editingPlayer ? editingPlayer.battletag : ''}
          close={newComp => this.closePlayerEditModal(newComp)}
          compositionID={id}
          isOpen={typeof editingPlayerID === 'number'}
        />
      </form>
    )
  }
}
