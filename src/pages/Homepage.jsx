import React from 'react'
import Banner from '../components/Banner/Banner'
import CoinsTable from '../components/CoinsTable'

const Homepage = () => {
  return (
    <div>
      <Banner />
      <CoinsTable />
      {/* Autres composants de la page d'accueil peuvent être ajoutés ici */}
    </div>
  )
}

export default Homepage