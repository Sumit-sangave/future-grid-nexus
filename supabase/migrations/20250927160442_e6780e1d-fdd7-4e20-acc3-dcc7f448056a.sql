-- Add additional profile fields for contact information
ALTER TABLE public.profiles 
ADD COLUMN contact_number TEXT,
ADD COLUMN address TEXT,
ADD COLUMN department TEXT;

-- Create chat_messages table for AI chat history
CREATE TABLE public.chat_messages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  response TEXT,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  session_id UUID NOT NULL
);

-- Enable RLS for chat_messages
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;

-- Create policies for chat_messages
CREATE POLICY "Users can view their own chat messages" 
ON public.chat_messages 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own chat messages" 
ON public.chat_messages 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create campus_metrics table for storing dashboard metrics
CREATE TABLE public.campus_metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  co2_saved_kg DECIMAL(10,2) NOT NULL DEFAULT 0,
  cost_savings_usd DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_generated_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
  total_consumed_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
  battery_charge_percent INTEGER NOT NULL DEFAULT 0,
  battery_runtime_hours INTEGER NOT NULL DEFAULT 0,
  battery_health_percent INTEGER NOT NULL DEFAULT 100,
  forecast_generation_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
  forecast_demand_kwh DECIMAL(10,2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS for campus_metrics (publicly readable for dashboard)
ALTER TABLE public.campus_metrics ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to read campus metrics
CREATE POLICY "Authenticated users can view campus metrics" 
ON public.campus_metrics 
FOR SELECT 
TO authenticated
USING (true);

-- Create policy to allow admins to update campus metrics
CREATE POLICY "Admins can update campus metrics" 
ON public.campus_metrics 
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);

-- Create trigger for automatic timestamp updates on campus_metrics
CREATE TRIGGER update_campus_metrics_updated_at
  BEFORE UPDATE ON public.campus_metrics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert initial campus metrics data
INSERT INTO public.campus_metrics (
  co2_saved_kg, 
  cost_savings_usd, 
  total_generated_kwh, 
  total_consumed_kwh,
  battery_charge_percent,
  battery_runtime_hours,
  battery_health_percent,
  forecast_generation_kwh,
  forecast_demand_kwh
) VALUES (
  1250.75, 
  3450.50, 
  2850.25, 
  2650.75,
  78,
  12,
  96,
  320.5,
  290.25
);