import renderer from 'react-test-renderer'
import { shallow } from 'enzyme'

import HeroSelect from '../../../app/assets/javascripts/components/hero-select.jsx'

describe('HeroSelect', () => {
  let component = null
  const hero1 = { id: 1, slug: 'hanzo', image: '/photo.jpg', name: 'Hanzo' }
  let heroIDSelected = hero1.id
  const hero2 = { id: 2, slug: 'ana', image: '/pic.bmp', name: 'Ana' }
  const props = {
    heroes: [hero1, hero2],
    onChange: newHeroID => { heroIDSelected = newHeroID },
    selectedHeroID: heroIDSelected,
    disabled: false,
    selectID: 'hero-select-dom-id',
    isDuplicate: false
  }

  beforeEach(() => {
    component = <HeroSelect {...props} />
  })

  test('matches snapshot', () => {
    const tree = renderer.create(component).toJSON()
    expect(tree).toMatchSnapshot()
  })

  test('can change selected hero', () => {
    const select = shallow(component).find(`#${props.selectID}`)
    select.simulate('change', { target: { value: hero2.id } })
    expect(heroIDSelected).toBe(hero2.id)
  })
})
