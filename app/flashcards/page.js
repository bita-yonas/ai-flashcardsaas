'use client'
import { useUser } from "@clerk/nextjs"
import { useEffect, useState } from "react"
import { collection, doc, getDoc, setDoc } from "firebase/firestore"
import { db } from "@/firebase"
import { useRouter } from "next/navigation"
import { Box, Card, CardActionArea, CardContent, Container, Grid, Typography, AppBar, Toolbar } from "@mui/material"

export default function Flashcards() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [flashcards, setFlashcards] = useState([])
  const router = useRouter()

  useEffect(() => {
    async function getFlashcards() {
      if (!user) return
      const docRef = doc(collection(db, 'users'), user.id)
      const docSnap = await getDoc(docRef)
      if (docSnap.exists()) {
        const collections = docSnap.data().flashcards || []
        setFlashcards(collections)
      } else {
        await setDoc(docRef, { flashcards: [] })
      }
    }
    getFlashcards()
  }, [user])

  if (!isLoaded || !isSignedIn) {
    return null
  }

  const handleCardClick = (id) => {
    router.push(`/flashcard?id=${id}`)
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/f1.jpg)', // Update this path to your image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top Bar */}
      <AppBar position="static" sx={{ backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Flashcard App
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container maxWidth="md" sx={{ mt: 4, mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.9)', borderRadius: 2, p: 4, flexGrow: 1 }}>
        <Typography variant="h4" component="h1" sx={{ mb: 4, fontWeight: 'bold', textAlign: 'center' }}>
          Saved Flashcards
        </Typography>
        <Grid container spacing={4}>
          {flashcards.map((flashcard, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ boxShadow: 3, '&:hover': { boxShadow: 6 }, borderRadius: 2 }}>
                <CardActionArea onClick={() => handleCardClick(flashcard.name)}>
                  <CardContent>
                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold', textAlign: 'center' }}>
                      {flashcard.name}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Bottom Bar */}
      <AppBar position="static" component="footer" sx={{ top: 'auto', bottom: 0, backgroundColor: 'black' }}>
        <Toolbar>
          <Typography variant="body1" sx={{ flexGrow: 1, textAlign: 'center' }}>
            © 2024 CardSpark AI. All rights reserved.
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}