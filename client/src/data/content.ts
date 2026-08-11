import {
  BriefcaseBusiness,
  CalendarCheck,
  Car,
  CheckCircle2,
  Clock,
  MapPinned,
  Plane,
  ShieldCheck,
  Sparkles,
  Star,
  SunSnow,
  Ticket,
  Trees,
  Users
} from 'lucide-react';

export const services = [
  { title: 'Aeroporto', description: 'Transfer de embarque e desembarque.', icon: Plane },
  { title: 'Shows', description: 'Ida e volta combinadas com antecedência.', icon: Ticket },
  { title: 'Eventos', description: 'Casamentos, festas, recepções e compromissos especiais.', icon: CalendarCheck },
  { title: 'Passeios', description: 'Praias, pontos turísticos e roteiros particulares.', icon: Trees },
  { title: 'Motorista particular', description: 'Corridas do cotidiano, sem intermediários.', icon: Car },
  { title: 'Executivo', description: 'Reuniões, empresas e compromissos profissionais.', icon: BriefcaseBusiness },
  { title: 'Viagens', description: 'Viagens previamente agendadas.', icon: MapPinned },
  { title: 'Empresarial', description: 'Atendimento direto para empresas e profissionais.', icon: Users }
];

export const benefits = [
  { title: 'Ar-condicionado', description: 'Sempre ligado durante a viagem.', icon: SunSnow },
  { title: 'Fiat Argo 2026', description: 'Veículo moderno para até 4 passageiros.', icon: Car },
  { title: 'Carro limpo', description: 'Higienização e organização antes das corridas.', icon: Sparkles },
  { title: 'Segurança', description: 'Direção responsável, estável e tranquila.', icon: ShieldCheck },
  { title: 'Pontualidade', description: 'Compromisso real com horários combinados.', icon: Clock },
  { title: 'Atendimento 5 estrelas', description: 'Experiência cordial, direta e personalizada.', icon: Star },
  { title: '+4 mil viagens', description: 'Experiência prática em diferentes rotas.', icon: CheckCircle2 },
  { title: 'Atendimento direto', description: 'Você fala com o próprio motorista.', icon: Users }
];

export const reviews = [
  {
    name: 'Mariana A.',
    text: 'Motorista Sampaio super simpático e educado. O carro estava muito limpo, e a viagem foi bastante tranquila.'
  },
  {
    name: 'Carlos M.',
    text: 'Agendei para o aeroporto, e Sampaio chegou antes do horário combinado. Excelente atendimento.'
  },
  {
    name: 'Fernanda R.',
    text: 'Carro confortável, ar-condicionado ligado e direção muito tranquila.'
  },
  {
    name: 'Lucas P.',
    text: 'Utilizamos o serviço para um show, e foi excelente ter toda a corrida previamente combinada.'
  },
  {
    name: 'Roberto S.',
    text: 'Utilizei o serviço executivo, e o atendimento foi extremamente profissional.'
  }
];

export const steps = [
  'Informe sua viagem.',
  'Escolha passageiros, bagagens e horário.',
  'Receba o resumo.',
  'A solicitação é registrada.',
  'Continue pelo WhatsApp.',
  'Sampaio confirma disponibilidade e valor.'
];
