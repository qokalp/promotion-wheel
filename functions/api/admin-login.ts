import bcrypt from 'bcryptjs';

interface Env {
  ADMIN_PASSWORD_HASH: string;
  ALLOWED_ORIGIN?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  // CORS headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { password } = await request.json();

    if (!password || typeof password !== 'string') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Password is required',
          status: 'ERROR',
        }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Verify password
    const isValid = await bcrypt.compare(password, env.ADMIN_PASSWORD_HASH);

    if (!isValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Invalid password',
          status: 'ERROR',
        }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    // Generate a simple session token (in production, use proper JWT)
    const token = btoa(JSON.stringify({
      authenticated: true,
      timestamp: Date.now(),
    }));

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          authenticated: true,
          token,
        },
        status: 'SUCCESS',
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
          'Set-Cookie': `admin_token=${token}; HttpOnly; Secure; SameSite=Strict; Max-Age=3600`,
        },
      }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Internal server error',
        status: 'ERROR',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
};

