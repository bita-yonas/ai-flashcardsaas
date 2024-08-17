
 'use client'
import { useState } from 'react'
import { db } from '@/firebase'
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  CardContent,
  Card,
  Grid,
  CardActionArea,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  CircularProgress,
  AppBar,
  Toolbar,
  Link,
} from '@mui/material'
import { useRouter } from 'next/navigation'
import { useUser } from '@clerk/nextjs'
import { doc, collection, setDoc, getDoc, writeBatch } from 'firebase/firestore'
import Swal from 'sweetalert2'

export default function Generate() {
  const { isLoaded, isSignedIn, user } = useUser()
  const [text, setText] = useState('')
  const [flashcards, setFlashcards] = useState([])
  const [flipped, setFlipped] = useState({})
  const [setName, setSetName] = useState('')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async () => {
    setLoading(true)
    fetch('api/generate', {
      method: 'POST',
      body: text,
    })
      .then((res) => res.json())
      .then((data) => {
        setFlashcards(data)
        setFlipped({}) // Reset flipped state to ensure all new cards are unflipped
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const handleCardFlip = (id) => {
    setFlipped((prev) => ({
      ...prev,
      [id]: !prev[id],
    }))
  }

  const handleOpen = () => {
    if (!isSignedIn) {
      Swal.fire({
        title: 'Please log in',
        text: 'You need to be logged in to save flashcards.',
        icon: 'warning',
        confirmButtonText: 'Log In',
      }).then((result) => {
        if (result.isConfirmed) {
          router.push('/sign-in') // Redirect to the sign-in page
        }
      })
    } else {
      setDialogOpen(true)
    }
  }

  const handleCloseDialog = () => {
    setDialogOpen(false)
  }

  const saveFlashcards = async () => {
    if (!setName.trim()) {
      alert('Please enter a name for your flashcard set.')
      return
    }

    setLoading(true)
    const batch = writeBatch(db)
    const userDocRef = doc(collection(db, 'users'), user.id)
    const docSnap = await getDoc(userDocRef)

    if (docSnap.exists()) {
      const collections = docSnap.data().flashcards || []
      if (collections.find((f) => f.name === setName)) {
        alert('A flashcard collection with the same name already exists')
        setLoading(false)
        return
      } else {
        collections.push({ name: setName })
        batch.set(userDocRef, { flashcards: collections }, { merge: true })
      }
    } else {
      batch.set(userDocRef, { flashcards: [{ name: setName }] })
    }

    const colRef = collection(userDocRef, setName)
    flashcards.forEach((flashcard) => {
      const cardDocRef = doc(colRef)
      batch.set(cardDocRef, flashcard)
    })

    await batch.commit()
    setLoading(false)
    handleCloseDialog()
    router.push('/flashcards')
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: 'url(/f1.jpg)', // Path to your background image
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        flexDirection: 'column',
        padding: '30px',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          mt: 4, 
          mb: 12, 
          borderRadius: '15px',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.5)',
          padding: '30px',
          backgroundColor: 'rgba(0, 0, 0, 0.75)', // Semi-transparent black background to see the image through
          color: 'white', // White text color for contrast
        }}
      >
        <Box
          sx={{
            mt: 4,
            mb: 6,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px',
            borderRadius: '15px',
            boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
            backgroundColor: 'rgba(0, 0, 0, 0.8)', // Darker semi-transparent background for content areas
          }}
        >
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Generate Flashcards
          </Typography>
          <Paper 
            elevation={3} 
            sx={{ 
              p: 4, 
              width: '100%', 
              maxWidth: 600, 
              mt: 2, 
              borderRadius: '15px',
              backgroundColor: 'rgba(34, 34, 34, 0.85)', // Dark background for input form
              color: 'white',
            }}
          >
            <TextField 
              value={text}
              onChange={(e) => setText(e.target.value)}
              label="Enter text"
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              sx={{ 
                mb: 2, 
                backgroundColor: 'rgba(51, 51, 51, 0.85)', // Darker background for text field
                borderRadius: '8px',
                input: { color: 'white' }, // White text in input
              }}
              InputLabelProps={{
                style: { color: 'white' }, // White label text
              }}
            />  
            <Button
  variant="contained"
  color="primary"
  onClick={handleSubmit}
  fullWidth
  sx={{
    height: 56,
    backgroundColor: 'linear-gradient(135deg, #004d40 30%, #00796b 90%)', // Muted teal and green gradient
    '&:hover': {
      backgroundColor: 'linear-gradient(135deg, #00796b 30%, #004d40 90%)',
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
    borderRadius: '12px',
    color: '#e0f7fa', // Light cyan text for better contrast
    fontWeight: 'bold',
    textTransform: 'uppercase',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
>
  Submit
</Button>
          </Paper>
        </Box>

        {loading && (
          <Box
            sx={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1300,
            }}
          >
            <CircularProgress size={60} />
          </Box>
        )}

        {flashcards.length > 0 && !loading && (
          <Box sx={{ mt: 6 }}>
            <Typography variant="h5" component="h2" align="center" gutterBottom>
              Flashcard Preview
            </Typography>
            <Grid container spacing={4} justifyContent="center">
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
                      onClick={() => handleCardFlip(index)}
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
                          {flipped[index] ? flashcard.back: flashcard.front}
                        </Typography>
                        </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button
  sx={{
    padding: '10px 24px',
    fontSize: '16px',
    fontWeight: 'bold',
    borderRadius: '8px',
    backgroundColor: 'linear-gradient(135deg, #1e88e5 30%, #7b1fa2 90%)', // Blue to purple gradient
    '&:hover': {
      backgroundColor: 'linear-gradient(135deg, #7b1fa2 30%, #1e88e5 90%)', // Purple to blue gradient on hover
      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
      transform: 'translateY(-2px)',
    },
    color: '#e1f5fe', // Light blue text color for better contrast
    textTransform: 'uppercase',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
    transition: 'transform 0.2s, box-shadow 0.2s',
  }}
  variant="contained"
  color="success"
  onClick={handleOpen}
>
  Save Flashcards
</Button>
        </Box>
      </Box>
    )}
  </Container>

  <Dialog open={dialogOpen} onClose={handleCloseDialog}>
    <DialogTitle>Save Flashcard Set</DialogTitle>
    <DialogContent>
      {isSignedIn && (
        <>
          <DialogContentText>Please enter a name for your flashcard set.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Set Name"
            type="text"
            fullWidth
            value={setName}
            onChange={(e) => setSetName(e.target.value)}
            variant="outlined"
          />
        </>
      )}
    </DialogContent>
    <DialogActions>
      <Button onClick={handleCloseDialog}>Cancel</Button>
      {isSignedIn && (
        <Button onClick={saveFlashcards} color="info">
          Save
        </Button>
      )}
    </DialogActions>
  </Dialog>
  <AppBar position="fixed" color="primary" sx={{ top: 'auto', bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.85)' }}>
    <Toolbar>
      <Typography variant="body1" color="inherit" align="center" sx={{ flexGrow: 1, color: 'white' }}>
        © 2024 CardSpark AI, All rights reserved.
      </Typography>
      <Link href="#" color="inherit" underline="none">
        Privacy Policy
      </Link>
    </Toolbar>
  </AppBar>
</Box>
  );
}


