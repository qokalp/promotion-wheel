interface Env {
  GOOGLE_SHEETS_ID: string;
  GOOGLE_SHEETS_API_KEY: string;
  ALLOWED_ORIGIN?: string;
}

interface SpinResult {
  name: string;
  phone: string;
  prize: string;
  timestamp: string;
}

// Google Sheets API helper
async function appendToSheet(
  sheetId: string, 
  apiKey: string, 
  data: SpinResult
): Promise<{ success: boolean; error?: string }> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Results!A:D:append?valueInputOption=RAW&key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        values: [[
          data.timestamp,
          data.name,
          data.phone,
          data.prize
        ]]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Sheets API error:', response.status, errorData);
      return { success: false, error: `Google Sheets API error: ${response.status}` };
    }

    return { success: true };
  } catch (error) {
    console.error('Error appending to Google Sheets:', error);
    return { success: false, error: 'Failed to append to Google Sheets' };
  }
}

async function checkPhoneExists(
  sheetId: string, 
  apiKey: string, 
  phone: string
): Promise<{ exists: boolean; error?: string }> {
  try {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Results!C:C?key=${apiKey}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('Google Sheets API error:', response.status, errorData);
      return { exists: false, error: `Google Sheets API error: ${response.status}` };
    }

    const data = await response.json();
    const phoneNumbers = data.values?.flat() || [];
    
    // Check if phone number exists (case-insensitive)
    const exists = phoneNumbers.some((existingPhone: string) => 
      existingPhone?.toString().trim() === phone.toString().trim()
    );

    return { exists };
  } catch (error) {
    console.error('Error checking phone in Google Sheets:', error);
    return { exists: false, error: 'Failed to check phone number' };
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { action, data } = await request.json();

    if (action === 'recordSpin') {
      const result: SpinResult = data;

      // Validate required fields
      if (!result.name || !result.phone || !result.prize || !result.timestamp) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Missing required fields',
            status: 'ERROR',
          }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Check if phone already exists
      const phoneCheck = await checkPhoneExists(env.GOOGLE_SHEETS_ID, env.GOOGLE_SHEETS_API_KEY, result.phone);
      
      if (phoneCheck.error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: phoneCheck.error,
            status: 'ERROR',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      if (phoneCheck.exists) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Phone number already exists',
            status: 'ALREADY_EXISTS',
          }),
          {
            status: 409,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      // Record the result
      const appendResult = await appendToSheet(env.GOOGLE_SHEETS_ID, env.GOOGLE_SHEETS_API_KEY, result);
      
      if (!appendResult.success) {
        return new Response(
          JSON.stringify({
            success: false,
            error: appendResult.error,
            status: 'ERROR',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: 'Result recorded successfully',
          status: 'RECORDED',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid action',
        status: 'ERROR',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Google Sheets API error:', error);
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

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const { request, env } = context;
  
  const corsHeaders = {
    'Access-Control-Allow-Origin': env.ALLOWED_ORIGIN || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(request.url);
    const action = url.searchParams.get('action');
    const phone = url.searchParams.get('phone');

    if (action === 'checkPhone' && phone) {
      const phoneCheck = await checkPhoneExists(env.GOOGLE_SHEETS_ID, env.GOOGLE_SHEETS_API_KEY, phone);
      
      if (phoneCheck.error) {
        return new Response(
          JSON.stringify({
            success: false,
            error: phoneCheck.error,
            status: 'ERROR',
          }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            exists: phoneCheck.exists,
            phone: phone,
          },
          status: 'SUCCESS',
        }),
        {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      );
    }

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Invalid action',
        status: 'ERROR',
      }),
      {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Google Sheets API error:', error);
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
