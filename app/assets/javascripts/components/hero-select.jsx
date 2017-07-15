import PropTypes from 'prop-types'

class HeroSelect extends React.Component {
  constructor(props) {
    super(props)
    this.state = { isOpen: false }
  }

  onMenuItemClick(event, heroID) {
    event.preventDefault()
    event.target.blur()
    this.setState({ isOpen: false }, () => {
      this.props.onChange(heroID)
    })
  }

  heroPortrait() {
    const { heroes, selectedHeroID } = this.props
    if (typeof selectedHeroID !== 'number') {
      return (
        <span className="hero-portrait-placeholder" />
      )
    }
    const hero = heroes.filter(h => h.id === selectedHeroID)[0]
    return (
      <img
        src={hero.image}
        alt={hero.name}
        className="hero-portrait"
      />
    )
  }

  menuClass() {
    const classes = ['menu']
    if (this.props.disabled) {
      classes.push('is-disabled')
    }
    return classes.join(' ')
  }

  isFilled() {
    return typeof this.props.selectedHeroID === 'number'
  }

  containerClass() {
    const classes = ['hero-select-container menu-container']
    if (!this.isFilled()) {
      classes.push('not-filled')
    }
    if (this.props.isDuplicate) {
      classes.push('is-duplicate')
    }
    if (this.state.isOpen) {
      classes.push('open')
    }
    return classes.join(' ')
  }

  toggleMenuOpen(event) {
    event.target.blur()
    this.setState({ isOpen: !this.state.isOpen })
  }

  render() {
    const { heroes, selectedHeroID } = this.props
    const isFilled = this.isFilled()
    let selectedHeroName = 'Hero'
    if (isFilled) {
      selectedHeroName = heroes.filter(h => h.id === selectedHeroID)[0].name
    }
    return (
      <div className={this.containerClass()}>
        <button
          type="button"
          className="button menu-toggle"
          onClick={e => this.toggleMenuOpen(e)}
        >
          {this.heroPortrait()} {selectedHeroName} <i className="fa fa-caret-down" />
        </button>
        <div className={this.menuClass()}>
          {heroes.map(hero => (
            <button
              key={hero.id}
              className="menu-item button"
              onClick={e => this.onMenuItemClick(e, hero.id)}
            >
              <img
                src={hero.image}
                alt={hero.name}
                className="hero-portrait"
              />
              {hero.name}
              {hero.id === selectedHeroID ? (
                <i className="fa fa-check menu-item-selected-indicator" />
              ) : ''}
            </button>
          ))}
        </div>
      </div>
    )
  }
}

HeroSelect.propTypes = {
  heroes: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedHeroID: PropTypes.number,
  disabled: PropTypes.bool.isRequired,
  isDuplicate: PropTypes.bool
}

export default HeroSelect
