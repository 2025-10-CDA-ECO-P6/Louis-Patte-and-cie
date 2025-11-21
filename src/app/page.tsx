'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { fetchMockData } from '../utils/data-fetch'
import SearchBar from '../components/SearchableAnimalList'

export default function Page() {
  const [searchQuery, setSearchQuery] = useState('')
  const [mockData, setMockData] = useState<any>(null)

  // Load data on mount
  useEffect(() => {
    fetchMockData().then(setMockData)
  }, [])

  if (!mockData) return <div>Loading...</div>

  const animals = mockData.animaux;
  const proprietaires = mockData.proprietaires;

  const getOwner = (proprietaire_id: number) => {
    return proprietaires.find((owner: any) => owner.id === proprietaire_id)
  }

  const filteredAnimals = animals.filter((animal: any) => {
    const owner = getOwner(animal.proprietaire_id);
    const searchLower = searchQuery.toLowerCase();
    
    return (
      animal.nom.toLowerCase().includes(searchLower) ||
      animal.espece.toLowerCase().includes(searchLower) ||
      animal.race.toLowerCase().includes(searchLower) ||
      (owner?.nom.toLowerCase().includes(searchLower)) ||
      (owner?.prenom.toLowerCase().includes(searchLower))
    );
  });

  return (
    <div className='container card'>
      <div className='title'>
        <h1><strong style={{ padding: '10px' }}>What's up Doc ? 🐶🐱</strong></h1>
      </div>
      <SearchBar value={searchQuery} onChange={setSearchQuery} />
      {filteredAnimals.map((animal: any) => {
        const proprio = getOwner(animal.proprietaire_id);
        return (
          <div key={animal.id} className='detailcard'> 
            <Link href={`/animal/${animal.id}`}>
              <div className='card-content'>
                {animal.photo && (
                  <img src={animal.photo} className='profilephoto' alt={animal.nom} />
                )}
                <div className='card-info'>
                  <h2>{animal.nom} 🐾</h2>
                    <div>
                      <p><strong>Espèce:</strong> {animal.espece} ({animal.race})</p>
                      <p><strong>Sexe:</strong> {animal.sexe === 'M' ? 'Mâle' : 'Femelle'}</p>
                      <p><strong>Propriétaire:</strong> {proprio?.prenom} {proprio?.nom}</p>
                      {animal.vaccinations && animal.vaccinations.length > 0 && (
                        <p><strong>Vaccination:</strong> {animal.vaccinations.map((v: any) => v.nom).join(', ')}</p>
                      )}
                    </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
      {filteredAnimals.length === 0 && searchQuery && (
        <div className='detailcard'>
          <p style={{ textAlign: 'center', padding: '20px' }}>
           Aucun animal ne correspond à "{searchQuery}"
          </p>
        </div>
      )}
    </div>
  )
}