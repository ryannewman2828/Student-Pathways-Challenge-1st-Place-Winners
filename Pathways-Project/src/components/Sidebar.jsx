import React, { PureComponent } from 'react'
import GrommetSidebar from 'grommet/components/Sidebar'
import Header from 'grommet/components/Header'
import Anchor from 'grommet/components/Anchor'
import Menu from 'grommet/components/Menu'
import Footer from 'grommet/components/Footer'
import Image from 'grommet/components/Image'
import WaypointIcon from 'grommet/components/icons/base/Waypoint'
import ClipboardIcon from 'grommet/components/icons/base/Clipboard'
import SearchIcon from 'grommet/components/icons/base/Search'
import FavouriteIcon from 'grommet/components/icons/base/Favorite'

export default class Sidebar extends PureComponent {
  render () {
    return (
      <GrommetSidebar colorIndex='neutral-1' justify='between' size='small'>
        <Header pad='medium' justify='center'>
          <Image
            align='center'
            alt='student pathways logo'
            src='images/pathwayLogo.png'
            size='small' />
        </Header>
        <Menu primary>
          <Anchor
            label='My Pathway'
            icon={<WaypointIcon />}
            path='/mypath' />
          <Anchor
            label='Recommendations'
            icon={<ClipboardIcon />}
            path='/recommendations' />
          <Anchor
            label='Search'
            icon={<SearchIcon />}
            path='/search' />
          <Anchor
            label='Favourites'
            icon={<FavouriteIcon />}
            path='/favourites' />
        </Menu>
        <Footer>
          <Anchor
            label='Logout'
            path='/' />
        </Footer>
      </GrommetSidebar>
    )
  }
}
