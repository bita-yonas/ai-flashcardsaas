

'use client'
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useSearchParams } from "next/navigation"
import { Box, CircularProgress, Container, Typography, Button } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ErrorIcon from '@mui/icons-material/Error'

const ResultPage = () => {
    const router = useRouter()
    const searchParams = useSearchParams()
    const session_id = searchParams.get('session_id')
    const [loading, setLoading] = useState(true)
    const [session, setSession] = useState(null)
    const [error, setError] = useState(null)
  
    useEffect(() => {
        const fetchCheckoutSession = async () => {
          if (!session_id) return
          try {
            const res = await fetch(`/api/checkout_session?session_id=${session_id}`)
            const sessionData = await res.json()
            if (res.ok) {
              setSession(sessionData)
            } else {
              setError(sessionData.error)
            }
          } catch (err) {
            setError('An error occurred while retrieving the session.')
          } finally {
            setLoading(false)
          }
        }
        fetchCheckoutSession()
      }, [session_id])

    if (loading) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <CircularProgress />
            <Typography variant="h6" sx={{mt: 2}}>
              Loading...
            </Typography>
          </Container>
        )
    }

    if (error) {
        return (
          <Container maxWidth="sm" sx={{textAlign: 'center', mt: 4}}>
            <ErrorIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
            <Typography variant="h6" color="error">
              {error}
            </Typography>
            <Button
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: '#d32f2f',
                '&:hover': { backgroundColor: '#b71c1c' },
                color: '#fff',
              }}
              onClick={() => router.push('/retry-payment')} 
            >
              Retry Payment
            </Button>
          </Container>
        )
    }

    return (
        <Container
          maxWidth="md"  
          sx={{
            textAlign: 'center',
            mt: 4,
            p: 4,  
            borderRadius: '12px',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            backgroundColor: session.payment_status === 'paid' ? '#e0f7fa' : '#ffebee',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            minHeight: '400px',  
          }}
        >
          {session.payment_status === 'paid' ? (
            <>
              <CheckCircleIcon sx={{ fontSize: 60, color: '#2e7d32', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#2e7d32', mb: 2 }}>
                Thank You for Your Purchase!
              </Typography>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="h6" sx={{ fontWeight: '500', color: '#004d40' }}>
                  Session ID: {session_id}
                </Typography>
                <Typography variant="body1" sx={{ mt: 1, color: '#004d40' }}>
                  We have received your payment. You will receive an email with the order details shortly.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: '#00796b',
                    '&:hover': { backgroundColor: '#004d40' },
                    color: '#fff',
                  }}
                  onClick={() => router.push('/order-details')} 
                >
                  View Order Details
                </Button>
              </Box>
            </>
          ) : (
            <>
              <ErrorIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#d32f2f', mb: 2 }}>
                Payment Failed
              </Typography>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
                <Typography variant="body1" sx={{ color: '#b71c1c' }}>
                  Your payment was not successful. Please try again.
                </Typography>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    backgroundColor: '#d32f2f',
                    '&:hover': { backgroundColor: '#b71c1c' },
                    color: '#fff',
                  }}
                  onClick={() => router.push('/retry-payment')} 
                >
                  Retry Payment
                </Button>
              </Box>
            </>
          )}
        </Container>
    )
}

export default ResultPage
