'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';

const SPECIALTIES = ['Anxiety', 'Depression', 'Couples Therapy', 'Trauma', 'Stress Management'];

const TIME_SLOTS = ['10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00'];

export function ClientBookingPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof typeof formData
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert('Randevu başarıyla oluşturuldu! Lütfen e-postanızı kontrol edin.');
    // Reset form
    setStep(1);
    setSelectedDate(undefined);
    setSelectedTime(undefined);
    setFormData({ firstName: '', lastName: '', phone: '', email: '', notes: '' });
  };

  const canProceedToStep2 = selectedDate !== undefined;
  const canProceedToStep3 = selectedDate !== undefined && selectedTime !== undefined;

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-background py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Book Your Session
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Schedule an appointment with our specialist psychologist. Select your preferred date and time.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left Column - Psychologist Profile */}
          <Card className="rounded-2xl border-0 shadow-lg overflow-hidden h-fit">
            <div className="bg-gradient-to-br from-primary to-accent p-8 text-primary-foreground">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-primary-foreground rounded-full flex items-center justify-center text-5xl mb-6 shadow-lg">
                  👨‍⚕️
                </div>
                <h2 className="text-2xl font-bold text-center">Uzm. Klinik Psikolog</h2>
                <h3 className="text-lg font-semibold text-center mt-2">Ahmet Yılmaz</h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  With over 10 years of experience in clinical psychology, I specialize in helping individuals and couples navigate life's challenges with evidence-based therapeutic approaches.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-lg">🎯</span> Uzmanlık Alanları
                </h4>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map((specialty) => (
                    <Badge
                      key={specialty}
                      variant="secondary"
                      className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/80"
                    >
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-border space-y-3">
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Clock className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span>Session Duration: 50 minutes</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span>Online & In-person Available</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Right Column - Booking Form */}
          <div className="space-y-6">
            {/* Progress Indicator */}
            <div className="flex gap-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`flex-1 h-1 rounded-full transition-colors ${
                    s <= step ? 'bg-primary' : 'bg-border'
                  }`}
                ></div>
              ))}
            </div>

            <Card className="rounded-2xl border-0 shadow-lg p-8">
              {/* Step 1: Date Selection */}
              {step === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                      <CalendarIcon className="w-5 h-5 text-primary" />
                      Select a Date
                    </h3>
                    <div className="bg-muted rounded-xl p-4 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => date < new Date() || date.getDay() === 0}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="w-full rounded-lg h-12 text-base font-semibold"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Time Selection */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-primary" />
                      Select a Time
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate?.toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    <div className="grid grid-cols-3 gap-3">
                      {TIME_SLOTS.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            selectedTime === time
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={() => setStep(1)}
                      variant="outline"
                      className="flex-1 rounded-lg h-12"
                    >
                      Back
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 rounded-lg h-12 text-base font-semibold"
                    >
                      Continue <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Contact Form */}
              {step === 3 && (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                      <MessageSquare className="w-5 h-5 text-primary" />
                      Your Information
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate?.toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      at {selectedTime}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="First Name"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange(e, 'firstName')}
                      className="rounded-lg border-border"
                      required
                    />
                    <Input
                      placeholder="Last Name"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange(e, 'lastName')}
                      className="rounded-lg border-border"
                      required
                    />
                  </div>

                  <Input
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={(e) => handleInputChange(e, 'email')}
                    className="rounded-lg border-border"
                    required
                  />

                  <Input
                    type="tel"
                    placeholder="Phone Number"
                    value={formData.phone}
                    onChange={(e) => handleInputChange(e, 'phone')}
                    className="rounded-lg border-border"
                    required
                  />

                  <Textarea
                    placeholder="Eklemek İstedikleriniz (Optional notes about your situation)"
                    value={formData.notes}
                    onChange={(e) => handleInputChange(e, 'notes')}
                    className="rounded-lg border-border min-h-24"
                  />

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      onClick={() => setStep(2)}
                      variant="outline"
                      className="flex-1 rounded-lg h-12"
                      disabled={isSubmitting}
                    >
                      Back
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-lg h-12 text-base font-semibold"
                    >
                      {isSubmitting ? 'Creating...' : 'Randevu Oluştur'}
                    </Button>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
