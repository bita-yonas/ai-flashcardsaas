'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDocs } from "firebase/firestore"
import { db } from "@/firebase"
import { useSearchParams } from "next/navigation"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography } from "@mui/material"

export default function Flashcard() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const searchParams = useSearchParams()
  const search = searchParams.get('id')

  useEffect(() => {
    async function getFlashcard() {
      if (!search || !user) return
      const colRef = collection(doc(collection(db, 'users'), user.id), search)
      const docs = await getDocs(colRef)
      const flashcards = []
      docs.forEach((doc) => {
        flashcards.push({ id: doc.id, ...doc.data() })
      })
      setFlashcards(flashcards)
    }
    getFlashcard()
  }, [user, search])

  const handleCardClick = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  if (!isLoaded || !isSignedIn) {
    return <></>
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        {flashcards.map((flashcard, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{
                perspective: '1000px',
                backgroundColor: 'transparent',
                boxShadow: 'none',
                borderRadius: '15px',
                overflow: 'visible',
              }}
            >
              <CardActionArea
                onClick={() => handleCardClick(index)}
                sx={{
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.8s',
                  transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  boxShadow: flipped[index]
                    ? '0 15px 30px rgba(0,0,0,0.2), 0 5px 15px rgba(0,0,0,0.1)'
                    : '0 10px 20px rgba(0,0,0,0.2), 0 5px 10px rgba(0,0,0,0.1)',
                  borderRadius: '15px',
                  position: 'relative',
                  height: '250px',
                  backgroundColor: flipped[index] ? '#ff5722' : '#1976d2',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.25rem',
                  padding: '20px',
                }}
              >
                <CardContent
                  sx={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    transform: flipped[index] ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  <Typography variant="h6" component="div">
                    {flipped[index] ? flashcard.back : flashcard.front}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}