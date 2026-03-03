'use client';

import { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MessageSquare, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface BookingPageProps {
  params: {
    username: string;
  };
}

interface AppointmentData {
  id: string;
  clientName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  notes: string;
  psychologist_username: string;
  type: 'online' | 'face-to-face';
  status: 'pending' | 'approved' | 'rejected';
}

const SPECIALTIES = [
  'Anksiyete',
  'Depresyon',
  'Çift Terapisi',
  'Travma',
  'Stres Yönetimi',
];

const TIME_SLOTS = [
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
];

export default function ClientBookingPage({
  params,
}: BookingPageProps) {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | undefined>(undefined);
  const [sessionType, setSessionType] = useState<'online' | 'face-to-face'>('online');
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

    try {
      // Validate form
      if (!formData.firstName.trim() || !formData.lastName.trim()) {
        toast({
          title: 'Hata',
          description: 'Lütfen ad ve soyadınızı giriniz.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.email.trim() || !formData.email.includes('@')) {
        toast({
          title: 'Hata',
          description: 'Lütfen geçerli bir e-posta adresi giriniz.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      if (!formData.phone.trim()) {
        toast({
          title: 'Hata',
          description: 'Lütfen telefon numaranızı giriniz.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Format date as YYYY-MM-DD for consistent comparison
      if (!selectedDate) {
        toast({
          title: 'Hata',
          description: 'Lütfen bir tarih seçiniz.',
          variant: 'destructive',
        });
        setIsSubmitting(false);
        return;
      }
      
      const date = selectedDate;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      const appointment: AppointmentData = {
        id: Math.random().toString(36).substr(2, 9),
        clientName: `${formData.firstName} ${formData.lastName}`,
        phone: formData.phone,
        email: formData.email,
        date: formattedDate,
        time: selectedTime || '',
        notes: formData.notes,
        psychologist_username: params.username,
        type: sessionType,
        status: 'pending',
      };

      // Get existing appointments
      const appointmentsJSON = localStorage.getItem('mock_appointments');
      const appointments: AppointmentData[] = appointmentsJSON
        ? JSON.parse(appointmentsJSON)
        : [];

      // Add new appointment
      appointments.push(appointment);
      localStorage.setItem('mock_appointments', JSON.stringify(appointments));

      toast({
        title: 'Başarılı',
        description: 'Randevu başarıyla oluşturuldu! Lütfen e-postanızı kontrol edin.',
      });

      // Reset form
      setStep(1);
      setSelectedDate(undefined);
      setSelectedTime(undefined);
      setFormData({
        firstName: '',
        lastName: '',
        phone: '',
        email: '',
        notes: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceedToStep2 = selectedDate !== undefined;
  const canProceedToStep3 =
    selectedDate !== undefined && selectedTime !== undefined;

  // Get available time slots based on selected date
  const getAvailableTimeSlots = () => {
    const appointmentsJSON = localStorage.getItem('mock_appointments');
    const appointments: AppointmentData[] = appointmentsJSON
      ? JSON.parse(appointmentsJSON)
      : [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday = selectedDate && selectedDate.getTime() === today.getTime();

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinutes = now.getMinutes();
    const currentTimeInMinutes = currentHour * 60 + currentMinutes;

    // Format selected date as YYYY-MM-DD for comparison
    const selectedDateStr = selectedDate ? 
      `${selectedDate.getFullYear()}-${String(selectedDate.getMonth() + 1).padStart(2, '0')}-${String(selectedDate.getDate()).padStart(2, '0')}` : '';

    return TIME_SLOTS.map((time) => {
      const [hours, minutes] = time.split(':').map(Number);
      const timeInMinutes = hours * 60 + minutes;

      // Check if time is in the past (if today is selected)
      const isPast = isToday && timeInMinutes <= currentTimeInMinutes;

      // Check if time slot is already booked with approved status
      const isBooked = appointments.some(
        (apt) =>
          apt.date === selectedDateStr &&
          apt.time === time &&
          apt.status === 'approved'
      );

      return {
        time,
        disabled: isPast || isBooked,
        reason: isPast ? 'Geçmiş Saat' : isBooked ? 'Dolu' : '',
      };
    });
  };

  const availableSlots = getAvailableTimeSlots();

  return (
    <div className="min-h-screen bg-gradient-to-b from-stone-50 to-background py-8 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Randevu Oluştur
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Uzman psikolog ile bir seans belirleyin. Tercih ettiğiniz tarih ve saati seçin.
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
                <h2 className="text-2xl font-bold text-center">
                  Uzm. Klinik Psikolog
                </h2>
                <h3 className="text-lg font-semibold text-center mt-2">
                  Ahmet Yılmaz
                </h3>
              </div>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <p className="text-muted-foreground leading-relaxed">
                  10 yıldan fazla klinik psikoloji deneyimiyle, bireyleri ve çiftleri yaşamın zorlukları
                  ile başa çıkmasında kanıta dayalı terapötik yöntemler kullanarak yardımcı oluyorum.
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
                  <span>Seans Süresi: 50 dakika</span>
                </div>
                <div className="flex items-center gap-3 text-muted-foreground">
                  <MessageSquare className="w-5 h-5 flex-shrink-0 text-primary" />
                  <span>Online & Yüz Yüze Mevcut</span>
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
                      Tarih Seçin
                    </h3>
                    <div className="bg-muted rounded-xl p-4 flex justify-center">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        disabled={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);
                          const checkDate = new Date(date);
                          checkDate.setHours(0, 0, 0, 0);
                          return checkDate < today || date.getDay() === 0;
                        }}
                        className="w-full"
                      />
                    </div>
                  </div>

                  <Button
                    onClick={() => setStep(2)}
                    disabled={!canProceedToStep2}
                    className="w-full rounded-lg h-12 text-base font-semibold"
                  >
                    Devam Et <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              )}

              {/* Step 2: Time Selection and Session Type */}
              {step === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-foreground flex items-center gap-2 mb-4">
                      <Clock className="w-5 h-5 text-primary" />
                      Saat ve Türü Seçin
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate?.toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>

                    {/* Session Type Selection */}
                    <div className="mb-6">
                      <label className="text-sm font-semibold text-foreground block mb-3">
                        Seans Türü
                      </label>
                      <div className="flex gap-3">
                        <button
                          onClick={() => setSessionType('online')}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                            sessionType === 'online'
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          Online
                        </button>
                        <button
                          onClick={() => setSessionType('face-to-face')}
                          className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all ${
                            sessionType === 'face-to-face'
                              ? 'bg-primary text-primary-foreground shadow-lg'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          Yüz Yüze
                        </button>
                      </div>
                    </div>

                    {/* Time Slots */}
                    <label className="text-sm font-semibold text-foreground block mb-3">
                      Saat
                    </label>
                    <div className="grid grid-cols-3 gap-3">
                      {availableSlots.map((slot) => (
                        <button
                          key={slot.time}
                          onClick={() => !slot.disabled && setSelectedTime(slot.time)}
                          disabled={slot.disabled}
                          title={slot.reason}
                          className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                            selectedTime === slot.time
                              ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                              : slot.disabled
                              ? 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                              : 'bg-muted text-foreground hover:bg-muted/80'
                          }`}
                        >
                          {slot.time}
                          {slot.disabled && (
                            <span className="text-xs block mt-1">
                              {slot.reason}
                            </span>
                          )}
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
                      Geri
                    </Button>
                    <Button
                      onClick={() => setStep(3)}
                      disabled={!canProceedToStep3}
                      className="flex-1 rounded-lg h-12 text-base font-semibold"
                    >
                      Devam Et <ArrowRight className="w-4 h-4 ml-2" />
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
                      Bilgileriniz
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {selectedDate?.toLocaleDateString('tr-TR', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}{' '}
                      saat {selectedTime}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Ad"
                      value={formData.firstName}
                      onChange={(e) =>
                        handleInputChange(e, 'firstName')
                      }
                      className="rounded-lg border-border"
                      required
                    />
                    <Input
                      placeholder="Soyad"
                      value={formData.lastName}
                      onChange={(e) =>
                        handleInputChange(e, 'lastName')
                      }
                      className="rounded-lg border-border"
                      required
                    />
                  </div>

                  <Input
                    type="email"
                    placeholder="E-posta Adresi"
                    value={formData.email}
                    onChange={(e) =>
                      handleInputChange(e, 'email')
                    }
                    className="rounded-lg border-border"
                    required
                  />

                  <Input
                    type="tel"
                    placeholder="Telefon Numarası"
                    value={formData.phone}
                    onChange={(e) =>
                      handleInputChange(e, 'phone')
                    }
                    className="rounded-lg border-border"
                    required
                  />

                  <Textarea
                    placeholder="Eklemek İstedikleriniz (İsteğe bağlı notlar)"
                    value={formData.notes}
                    onChange={(e) =>
                      handleInputChange(e, 'notes')
                    }
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
                      Geri
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-lg h-12 text-base font-semibold"
                    >
                      {isSubmitting ? 'Oluşturuluyor...' : 'Randevu Oluştur'}
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
