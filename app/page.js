'use client';

import getStripe from '@/utils/get-stripe';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import {
  Container,
  Button,
  Typography,
  Box,
  AppBar,
  Toolbar,
  Grid,
  Paper,
} from '@mui/material';
import Head from 'next/head';
import { motion } from 'framer-motion';

export default function Home() {
  const [text, setText] = useState('');
  const [flashcards, setFlashcards] = useState([]);

  const handleSubmit = async (planType) => {
    const response = await fetch('/api/checkout_session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        origin: 'http://localhost:3000',
      },
      body: JSON.stringify({ planType }),
    });

    const checkoutSessionJson = await response.json();

    if (response.status === 500) {
      console.error(checkoutSessionJson.error.message);
      return;
    }

    const stripe = await getStripe();
    const { error } = await stripe.redirectToCheckout({
      sessionId: checkoutSessionJson.id,
    });

    if (error) {
      console.warn(error.message);
    }
  };

  const featureVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <Head>
        <title>CardSpark AI</title>
        <meta name="description" content="Create flashcards from your text with CardSpark AI" />
      </Head>

      {/* Navigation Bar */}
      <AppBar position="sticky" sx={{ background: '#0d1117' }}>
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1, color: 'white' }}>
            CardSpark AI
          </Typography>
          <SignedOut>
            <Button color="inherit" href="/sign-in">Login</Button>
            <Button variant="contained" sx={{ backgroundColor: '#f06543', ml: 2 }} href="/sign-up">
              Sign Up
            </Button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </Toolbar>
      </AppBar>

    {/* Hero Section */}
<Box
  sx={{
    background: 'linear-gradient(to right, #0f2027, #203a43, #2c5364)',
    color: 'white',
    py: 20, // Increased padding to make the section taller
  }}
>
  <Container maxWidth="lg">
    <Grid container spacing={4}>
      {/* Left Side - Main Text */}
      <Grid item xs={12} md={7}>
        <Typography variant="h2" component="h1" gutterBottom>
          <span style={{ color: '#f06543' }}>CardSpark AI</span> Flashcard Generator
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Enter your text, and we'll generate flashcards for you in seconds. Master your content with our powerful study tools.
        </Typography>
      </Grid>

      {/* Right Side - Button and Additional Content */}
      <Grid item xs={12} md={5} sx={{ textAlign: 'right' }}>
        <Typography variant="h6" component="p" gutterBottom>
          Preview your generated flashcards
        </Typography>
        <motion.div initial="hidden" animate="visible" variants={featureVariants}>
          <Button
            variant="contained"
            sx={{
              backgroundColor: '#f06543',
              py: 2,
              px: 4,
              fontSize: '1.2rem',
              textTransform: 'none',
              mb: 2, // Add margin-bottom to create space below the button
            }}
            href="/generate" // Redirects to the generate page
          >
            Click here to start
          </Button>
        </motion.div>
        
        <Button
          variant="outlined"
          sx={{ mr: 1 }}
        >
          YouTube
        </Button>
        <Button
          variant="outlined"
        >
          Wikipedia
        </Button>
      </Grid>
    </Grid>
  </Container>
</Box>
      {/* Features Section */}
<Container maxWidth="lg" sx={{ mt: 5 }}>
  <Typography variant="h3" component="h2" gutterBottom sx={{ textAlign: 'center', mb: 4 }}>
    Stop wasting time making flashcards.
  </Typography>
  <Grid container spacing={4} alignItems="center">
    <Grid item xs={12} md={6}>
      <Typography variant="h4" component="h3" gutterBottom sx={{ fontSize: '3rem', mb: 2 }}>
        Create Flashcards from Text
      </Typography>
      <Typography sx={{ mb: 2 }}>
        CardSpark AI quickly generates flashcards from any text you provide, helping you study efficiently and effectively. Save time and focus on mastering your material. Whether you're preparing for exams or just need to review key concepts, CardSpark AI streamlines your study process.
      </Typography>
      <Button color="primary" href="#" sx={{ mt: 2 }}>
        Click Here to see examples!
      </Button>
    </Grid>
    <Grid item xs={12} md={6}>
      <Box
        component="img"
        src="/fl2.jpg" // Update with your image path
        alt="Create Flashcards from Text"
        sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
      />
    </Grid>
  </Grid>

  <Grid container spacing={4} alignItems="center" sx={{ mt: 6 }}>
    <Grid item xs={12} md={6}>
      <Box
        component="img"
        src="/fl1.jpg" // Update with your image path
        alt="Start Studying in Seconds"
        sx={{ width: '100%', height: 'auto', borderRadius: 2 }}
      />
    </Grid>
    <Grid item xs={12} md={6}>
      <Typography variant="h4" component="h3" gutterBottom sx={{ fontSize: '3rem', mb: 2 }}>
        Start Studying in Seconds
      </Typography>
      <Typography sx={{ mb: 2 }}>
        CardSpark AI provides easy-to-use study tools so you can start studying your flashcards immediately. Get started quickly and improve your learning efficiency. The seamless experience ensures that you spend more time learning and less time organizing.
      </Typography>
    </Grid>
  </Grid>
</Container>
      {/* Pricing Section */}
      <Container maxWidth="lg" sx={{ mt: 10 }}>
        <Typography variant="h4" component="h2" gutterBottom sx={{ textAlign: 'center' }}>
          Pricing
        </Typography>
        <Grid container spacing={4} justifyContent="center">
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#f8f9fa' }}>
              <Typography variant="h5" gutterBottom>
                Basic
              </Typography>
              <Typography variant="h6" gutterBottom>
                $5 / Month
              </Typography>
              <Typography variant="body1">
                Access to Basic Card Features. Perfect for individuals just getting started with flashcards.
              </Typography>
              <Button
                variant="contained"
                color="success"
                sx={{ mt: 2 }}
                onClick={() => handleSubmit('basic')}
              >
                Choose Basic
              </Button>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper elevation={3} sx={{ p: 3, backgroundColor: '#343a40', color: 'white' }}>
              <Typography variant="h5" gutterBottom>
                Pro
              </Typography>
              <Typography variant="h6" gutterBottom>
                $10 / Month
              </Typography>
              <Typography variant="body1">
                Access to Advanced Card Features and Priority Support. Ideal for power users and teams.
              </Typography>
              <Button
                variant="contained"
                color="error"
                sx={{ mt: 2 }}
                onClick={() => handleSubmit('pro')}
              >
                Choose Pro
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>

  {/* Footer */}
<Box sx={{ backgroundColor: '#0d1117', color: 'white', py: 5, mt: 10 }}>
  <Container maxWidth="lg">
    <Grid container spacing={4}>
      <Grid item xs={12} md={6}>
        <Typography variant="h6">
          CardSpark AI - Optimize your study routine
        </Typography>
        <Box sx={{ display: 'flex', mt: 2 }}>
          <Button color="inherit" href="https://www.instagram.com" sx={{ textTransform: 'none' }}>Instagram</Button>
          <Button color="inherit" href="https://www.linkedin.com/in/bitania-yonas-yirse-46b99a26b/" sx={{ textTransform: 'none', ml: 2 }}>
            LinkedIn
          </Button>
        </Box>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Generators
        </Typography>
        <Typography variant="body2">Text to Flashcards</Typography>
        <Typography variant="body2">Wikipedia to Flashcards</Typography>
      </Grid>
      <Grid item xs={12} md={2}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          Company
        </Typography>
        <Button color="inherit" sx={{ textTransform: 'none', padding: 0 }} onClick={() => alert('CardSpark AI is a tool designed to simplify studying by automatically generating flashcards from text inputs. Developed by Bitania yonas, it aims to make learning more efficient and effective.')}>
          About
        </Button>
        <Typography variant="body2"></Typography>
        <Button color="inherit" sx={{ textTransform: 'none', padding: 0 }} href="https://bitayonas.com">
          Contact
        </Button>
      </Grid>
    </Grid>
    <Typography variant="body2" sx={{ textAlign: 'center', mt: 5 }}>
      © 2024 CardSpark AI Solutions, LLC. All rights reserved.
    </Typography>
  </Container>
</Box>
    </div>
  );
}