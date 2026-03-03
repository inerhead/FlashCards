import { useState, useEffect, useCallback } from "react";

const WORDS = [
  // PHRASAL VERBS (25)
  { id:1, word:"break down", pron:"/breɪk daʊn/", emoji:"💔", cat:"Phrasal Verb", es:"descomponerse / desglosar",
    ex:["My car broke down on the highway.","Let me break down the problem for you.","She broke down in tears after the news."]},
  { id:2, word:"bring up", pron:"/brɪŋ ʌp/", emoji:"💬", cat:"Phrasal Verb", es:"mencionar / criar",
    ex:["Don't bring up politics at dinner.","She was brought up in a small village.","He brought up an interesting point."]},
  { id:3, word:"carry out", pron:"/ˈkæri aʊt/", emoji:"✅", cat:"Phrasal Verb", es:"llevar a cabo",
    ex:["The team carried out the experiment.","We need to carry out a full investigation.","She carried out her duties professionally."]},
  { id:4, word:"come across", pron:"/kʌm əˈkrɒs/", emoji:"🔍", cat:"Phrasal Verb", es:"encontrarse con / dar la impresión",
    ex:["I came across an old photo album.","She comes across as very confident.","We came across a beautiful waterfall."]},
  { id:5, word:"cut back", pron:"/kʌt bæk/", emoji:"✂️", cat:"Phrasal Verb", es:"reducir / recortar",
    ex:["We need to cut back on expenses.","The company cut back its workforce.","I'm cutting back on sugar."]},
  { id:6, word:"figure out", pron:"/ˈfɪɡər aʊt/", emoji:"🧩", cat:"Phrasal Verb", es:"descifrar / resolver",
    ex:["I can't figure out this puzzle.","She figured out the solution quickly.","Let's figure out a plan together."]},
  { id:7, word:"get along", pron:"/ɡet əˈlɒŋ/", emoji:"🤝", cat:"Phrasal Verb", es:"llevarse bien",
    ex:["Do you get along with your neighbors?","The siblings get along really well.","It's hard to get along with him."]},
  { id:8, word:"give up", pron:"/ɡɪv ʌp/", emoji:"🏳️", cat:"Phrasal Verb", es:"rendirse / dejar de",
    ex:["Never give up on your dreams.","He gave up smoking last year.","She refused to give up."]},
  { id:9, word:"hold on", pron:"/hoʊld ɒn/", emoji:"✋", cat:"Phrasal Verb", es:"esperar / agarrarse",
    ex:["Hold on, I'll be right back.","Hold on tight to the railing.","Can you hold on for a moment?"]},
  { id:10, word:"look forward to", pron:"/lʊk ˈfɔːrwərd tuː/", emoji:"🤩", cat:"Phrasal Verb", es:"esperar con ansias",
    ex:["I look forward to meeting you.","She's looking forward to the trip.","We look forward to your reply."]},
  { id:11, word:"make up", pron:"/meɪk ʌp/", emoji:"🎭", cat:"Phrasal Verb", es:"inventar / reconciliarse / maquillarse",
    ex:["He made up an excuse for being late.","They argued but made up quickly.","Women make up 60% of the workforce."]},
  { id:12, word:"pick up", pron:"/pɪk ʌp/", emoji:"📦", cat:"Phrasal Verb", es:"recoger / aprender",
    ex:["Can you pick up the kids from school?","She picked up Spanish while living abroad.","Business is starting to pick up."]},
  { id:13, word:"put off", pron:"/pʊt ɒf/", emoji:"⏰", cat:"Phrasal Verb", es:"posponer / desanimar",
    ex:["Stop putting off your homework.","The meeting was put off until Monday.","His attitude really puts me off."]},
  { id:14, word:"run into", pron:"/rʌn ˈɪntuː/", emoji:"😲", cat:"Phrasal Verb", es:"encontrarse con / chocar",
    ex:["I ran into my old teacher yesterday.","We ran into some difficulties.","The car ran into a tree."]},
  { id:15, word:"set up", pron:"/set ʌp/", emoji:"🔧", cat:"Phrasal Verb", es:"establecer / configurar",
    ex:["She set up her own business.","Can you help me set up the equipment?","They set up a meeting for Friday."]},
  { id:16, word:"sort out", pron:"/sɔːrt aʊt/", emoji:"📋", cat:"Phrasal Verb", es:"resolver / organizar",
    ex:["We need to sort out this mess.","I'll sort out the paperwork tomorrow.","Let me sort out the details."]},
  { id:17, word:"take over", pron:"/teɪk ˈoʊvər/", emoji:"👑", cat:"Phrasal Verb", es:"hacerse cargo / adquirir",
    ex:["She took over the company last year.","Can you take over while I'm away?","The new manager is taking over on Monday."]},
  { id:18, word:"turn down", pron:"/tɜːrn daʊn/", emoji:"👎", cat:"Phrasal Verb", es:"rechazar / bajar el volumen",
    ex:["She turned down the job offer.","Could you turn down the music?","He was turned down for a loan."]},
  { id:19, word:"work out", pron:"/wɜːrk aʊt/", emoji:"💪", cat:"Phrasal Verb", es:"hacer ejercicio / resolver / funcionar",
    ex:["I work out three times a week.","Things will work out in the end.","We need to work out a solution."]},
  { id:20, word:"look into", pron:"/lʊk ˈɪntuː/", emoji:"🔎", cat:"Phrasal Verb", es:"investigar",
    ex:["The police are looking into the matter.","I'll look into it and get back to you.","We should look into cheaper options."]},
  { id:21, word:"come up with", pron:"/kʌm ʌp wɪð/", emoji:"💡", cat:"Phrasal Verb", es:"idear / ocurrírsele",
    ex:["She came up with a brilliant idea.","Can you come up with a better plan?","He always comes up with excuses."]},
  { id:22, word:"end up", pron:"/end ʌp/", emoji:"🎯", cat:"Phrasal Verb", es:"terminar / acabar",
    ex:["We ended up staying until midnight.","If you're not careful, you'll end up in trouble.","She ended up becoming a doctor."]},
  { id:23, word:"point out", pron:"/pɔɪnt aʊt/", emoji:"👉", cat:"Phrasal Verb", es:"señalar / indicar",
    ex:["She pointed out several errors in the report.","I'd like to point out that we're running late.","He pointed out the benefits of the plan."]},
  { id:24, word:"turn out", pron:"/tɜːrn aʊt/", emoji:"🎲", cat:"Phrasal Verb", es:"resultar",
    ex:["It turned out to be a great decision.","The weather turned out fine.","Things didn't turn out as expected."]},
  { id:25, word:"put up with", pron:"/pʊt ʌp wɪð/", emoji:"😤", cat:"Phrasal Verb", es:"tolerar / soportar",
    ex:["I can't put up with this noise anymore.","She puts up with a lot of stress at work.","How do you put up with his behavior?"]},

  // ADJECTIVES (20)
  { id:26, word:"thorough", pron:"/ˈθʌr.oʊ/", emoji:"🔬", cat:"Adjective", es:"minucioso / exhaustivo",
    ex:["She did a thorough investigation.","The report was very thorough.","He gave the house a thorough cleaning."]},
  { id:27, word:"reluctant", pron:"/rɪˈlʌk.tənt/", emoji:"😟", cat:"Adjective", es:"reacio / reticente",
    ex:["He was reluctant to accept the offer.","She seemed reluctant to speak.","They were reluctant participants."]},
  { id:28, word:"overwhelming", pron:"/ˌoʊ.vərˈwel.mɪŋ/", emoji:"🌊", cat:"Adjective", es:"abrumador",
    ex:["The response was overwhelming.","She felt overwhelming sadness.","The evidence was overwhelming."]},
  { id:29, word:"appealing", pron:"/əˈpiː.lɪŋ/", emoji:"✨", cat:"Adjective", es:"atractivo / atrayente",
    ex:["The idea sounds very appealing.","The city is appealing to tourists.","It's not an appealing prospect."]},
  { id:30, word:"genuine", pron:"/ˈdʒen.ju.ɪn/", emoji:"💎", cat:"Adjective", es:"genuino / auténtico",
    ex:["She showed genuine concern.","Is this painting genuine?","He's a very genuine person."]},
  { id:31, word:"straightforward", pron:"/ˌstreɪtˈfɔːr.wərd/", emoji:"➡️", cat:"Adjective", es:"directo / sencillo",
    ex:["The instructions are straightforward.","He gave a straightforward answer.","The process is fairly straightforward."]},
  { id:32, word:"feasible", pron:"/ˈfiː.zə.bəl/", emoji:"🏗️", cat:"Adjective", es:"factible / viable",
    ex:["Is this plan economically feasible?","The project is perfectly feasible.","We need a more feasible solution."]},
  { id:33, word:"reliable", pron:"/rɪˈlaɪ.ə.bəl/", emoji:"🛡️", cat:"Adjective", es:"confiable / fiable",
    ex:["She's a very reliable employee.","This car is extremely reliable.","We need reliable data."]},
  { id:34, word:"harsh", pron:"/hɑːrʃ/", emoji:"❄️", cat:"Adjective", es:"duro / severo",
    ex:["The winter was particularly harsh.","His words were very harsh.","She faced harsh criticism."]},
  { id:35, word:"subtle", pron:"/ˈsʌt.əl/", emoji:"🎨", cat:"Adjective", es:"sutil",
    ex:["There's a subtle difference between them.","She gave a subtle hint.","The flavor is quite subtle."]},
  { id:36, word:"keen", pron:"/kiːn/", emoji:"🦅", cat:"Adjective", es:"entusiasta / agudo",
    ex:["She's a keen observer.","He's keen on learning Japanese.","I'm not keen on the idea."]},
  { id:37, word:"remarkable", pron:"/rɪˈmɑːr.kə.bəl/", emoji:"🌟", cat:"Adjective", es:"notable / extraordinario",
    ex:["She made a remarkable recovery.","The results were truly remarkable.","He has a remarkable memory."]},
  { id:38, word:"widespread", pron:"/ˈwaɪd.spred/", emoji:"🌍", cat:"Adjective", es:"generalizado / extendido",
    ex:["There is widespread concern about pollution.","The disease became widespread.","The practice is widespread in Asia."]},
  { id:39, word:"controversial", pron:"/ˌkɒn.trəˈvɜː.ʃəl/", emoji:"⚡", cat:"Adjective", es:"controvertido / polémico",
    ex:["The decision was highly controversial.","He made a controversial statement.","It's a controversial topic."]},
  { id:40, word:"inevitable", pron:"/ɪˈnev.ɪ.tə.bəl/", emoji:"⏳", cat:"Adjective", es:"inevitable",
    ex:["Change is inevitable.","The outcome was inevitable.","It was inevitable that they'd find out."]},

  // VERBS (20)
  { id:41, word:"acknowledge", pron:"/əkˈnɒl.ɪdʒ/", emoji:"🙏", cat:"Verb", es:"reconocer / admitir",
    ex:["He acknowledged his mistake.","The company acknowledged the problem.","She acknowledged his contribution."]},
  { id:42, word:"allocate", pron:"/ˈæl.ə.keɪt/", emoji:"📊", cat:"Verb", es:"asignar / destinar",
    ex:["We need to allocate more resources.","The funds were allocated to education.","How should we allocate the budget?"]},
  { id:43, word:"anticipate", pron:"/ænˈtɪs.ɪ.peɪt/", emoji:"🔮", cat:"Verb", es:"anticipar / prever",
    ex:["We anticipate a rise in prices.","She anticipated the problem.","I didn't anticipate such a response."]},
  { id:44, word:"compromise", pron:"/ˈkɒm.prə.maɪz/", emoji:"⚖️", cat:"Verb", es:"llegar a un acuerdo / comprometer",
    ex:["Both sides need to compromise.","Don't compromise your principles.","They reached a compromise."]},
  { id:45, word:"convey", pron:"/kənˈveɪ/", emoji:"📨", cat:"Verb", es:"transmitir / comunicar",
    ex:["Words can't convey my gratitude.","The painting conveys a sense of peace.","Please convey my regards."]},
  { id:46, word:"deceive", pron:"/dɪˈsiːv/", emoji:"🎭", cat:"Verb", es:"engañar",
    ex:["He tried to deceive the authorities.","Don't be deceived by appearances.","She felt deceived by his promises."]},
  { id:47, word:"demonstrate", pron:"/ˈdem.ən.streɪt/", emoji:"📐", cat:"Verb", es:"demostrar",
    ex:["The study demonstrates the link.","She demonstrated how to use it.","They demonstrated against the policy."]},
  { id:48, word:"diminish", pron:"/dɪˈmɪn.ɪʃ/", emoji:"📉", cat:"Verb", es:"disminuir / reducir",
    ex:["The pain began to diminish.","Nothing can diminish her achievement.","His influence has diminished over time."]},
  { id:49, word:"encounter", pron:"/ɪnˈkaʊn.tər/", emoji:"🤝", cat:"Verb", es:"encontrarse con / toparse",
    ex:["We encountered several obstacles.","I first encountered this idea in college.","She encountered resistance from the team."]},
  { id:50, word:"enhance", pron:"/ɪnˈhæns/", emoji:"⬆️", cat:"Verb", es:"mejorar / realzar",
    ex:["This will enhance your performance.","The lighting enhances the atmosphere.","Technology enhances our lives."]},
  { id:51, word:"imply", pron:"/ɪmˈplaɪ/", emoji:"🤔", cat:"Verb", es:"implicar / insinuar",
    ex:["Are you implying I'm wrong?","The data implies a connection.","His silence implied agreement."]},
  { id:52, word:"neglect", pron:"/nɪˈɡlekt/", emoji:"🚫", cat:"Verb", es:"descuidar / desatender",
    ex:["Don't neglect your health.","The building had been neglected for years.","She neglected to mention the cost."]},
  { id:53, word:"perceive", pron:"/pərˈsiːv/", emoji:"👁️", cat:"Verb", es:"percibir",
    ex:["How do others perceive you?","She perceived a change in his behavior.","The threat was perceived as serious."]},
  { id:54, word:"pursue", pron:"/pərˈsuː/", emoji:"🏃", cat:"Verb", es:"perseguir / dedicarse a",
    ex:["She decided to pursue a career in law.","The police pursued the suspect.","He pursued his dream relentlessly."]},
  { id:55, word:"reveal", pron:"/rɪˈviːl/", emoji:"🎁", cat:"Verb", es:"revelar / desvelar",
    ex:["The investigation revealed the truth.","She revealed her plans to the team.","The data reveals an interesting pattern."]},
  { id:56, word:"tackle", pron:"/ˈtæk.əl/", emoji:"🏈", cat:"Verb", es:"abordar / enfrentar",
    ex:["We need to tackle this problem head-on.","The government is tackling unemployment.","She tackled the challenge with enthusiasm."]},
  { id:57, word:"undergo", pron:"/ˌʌn.dərˈɡoʊ/", emoji:"🔄", cat:"Verb", es:"someterse a / experimentar",
    ex:["He underwent surgery last week.","The city has undergone major changes.","Applicants must undergo a background check."]},
  { id:58, word:"withdraw", pron:"/wɪðˈdrɔː/", emoji:"🏧", cat:"Verb", es:"retirar(se)",
    ex:["She withdrew money from the ATM.","The troops were withdrawn.","He withdrew from the competition."]},
  { id:59, word:"yield", pron:"/jiːld/", emoji:"🌾", cat:"Verb", es:"producir / ceder",
    ex:["The experiment yielded interesting results.","The tree yields fruit every summer.","He refused to yield to pressure."]},
  { id:60, word:"grasp", pron:"/ɡræsp/", emoji:"✊", cat:"Verb", es:"agarrar / comprender",
    ex:["She grasped the concept quickly.","He grasped her hand tightly.","I couldn't grasp what he meant."]},

  // NOUNS (20)
  { id:61, word:"drawback", pron:"/ˈdrɔː.bæk/", emoji:"⚠️", cat:"Noun", es:"desventaja / inconveniente",
    ex:["The main drawback is the cost.","Every plan has its drawbacks.","One drawback of living here is the traffic."]},
  { id:62, word:"outcome", pron:"/ˈaʊt.kʌm/", emoji:"🎯", cat:"Noun", es:"resultado",
    ex:["The outcome of the election was surprising.","We're waiting for the outcome.","A positive outcome is expected."]},
  { id:63, word:"insight", pron:"/ˈɪn.saɪt/", emoji:"💡", cat:"Noun", es:"perspicacia / perspectiva",
    ex:["The book provides valuable insights.","She has great insight into human nature.","His insights shaped the project."]},
  { id:64, word:"awareness", pron:"/əˈwer.nəs/", emoji:"🧠", cat:"Noun", es:"conciencia / conocimiento",
    ex:["There's growing awareness of the issue.","Raise awareness about climate change.","Self-awareness is key to growth."]},
  { id:65, word:"breakthrough", pron:"/ˈbreɪk.θruː/", emoji:"🚀", cat:"Noun", es:"avance / gran descubrimiento",
    ex:["Scientists made a major breakthrough.","This was a breakthrough in negotiations.","The breakthrough came after years of research."]},
  { id:66, word:"constraint", pron:"/kənˈstreɪnt/", emoji:"🔗", cat:"Noun", es:"restricción / limitación",
    ex:["Budget constraints limit our options.","Time is a major constraint.","We must work within these constraints."]},
  { id:67, word:"emphasis", pron:"/ˈem.fə.sɪs/", emoji:"❗", cat:"Noun", es:"énfasis",
    ex:["The emphasis is on quality.","She placed great emphasis on education.","There's a growing emphasis on sustainability."]},
  { id:68, word:"framework", pron:"/ˈfreɪm.wɜːrk/", emoji:"🏛️", cat:"Noun", es:"marco / estructura",
    ex:["We need a legal framework for this.","The framework guides our decisions.","He developed a theoretical framework."]},
  { id:69, word:"controversy", pron:"/ˈkɒn.trə.vɜː.si/", emoji:"🔥", cat:"Noun", es:"controversia / polémica",
    ex:["The policy caused great controversy.","There's controversy surrounding the decision.","He tried to avoid controversy."]},
  { id:70, word:"likelihood", pron:"/ˈlaɪ.kli.hʊd/", emoji:"📈", cat:"Noun", es:"probabilidad",
    ex:["There's a strong likelihood of rain.","In all likelihood, he'll agree.","The likelihood of success is high."]},
  { id:71, word:"setback", pron:"/ˈset.bæk/", emoji:"🚧", cat:"Noun", es:"contratiempo / revés",
    ex:["The project suffered a major setback.","Despite setbacks, she persevered.","It was only a temporary setback."]},
  { id:72, word:"prospect", pron:"/ˈprɒs.pekt/", emoji:"🔭", cat:"Noun", es:"perspectiva / posibilidad",
    ex:["The prospect of promotion excited her.","Job prospects are improving.","It's an exciting prospect."]},
  { id:73, word:"assumption", pron:"/əˈsʌmp.ʃən/", emoji:"💭", cat:"Noun", es:"suposición",
    ex:["We can't make that assumption.","The assumption proved to be wrong.","Challenge your assumptions."]},
  { id:74, word:"disruption", pron:"/dɪsˈrʌp.ʃən/", emoji:"💥", cat:"Noun", es:"interrupción / alteración",
    ex:["The storm caused major disruption.","Digital disruption is reshaping industries.","We apologize for the disruption."]},
  { id:75, word:"consensus", pron:"/kənˈsen.səs/", emoji:"🤝", cat:"Noun", es:"consenso",
    ex:["We reached a consensus on the issue.","There's no consensus among experts.","The consensus is that it's too risky."]},

  // ADVERBS (10)
  { id:76, word:"presumably", pron:"/prɪˈzuː.mə.bli/", emoji:"🤷", cat:"Adverb", es:"presumiblemente",
    ex:["Presumably, he'll arrive by noon.","She was presumably aware of the risk.","They had presumably left earlier."]},
  { id:77, word:"merely", pron:"/ˈmɪr.li/", emoji:"👐", cat:"Adverb", es:"simplemente / meramente",
    ex:["I was merely suggesting an idea.","It's merely a matter of time.","He merely nodded in response."]},
  { id:78, word:"roughly", pron:"/ˈrʌf.li/", emoji:"📏", cat:"Adverb", es:"aproximadamente / bruscamente",
    ex:["It costs roughly $500.","Roughly half the population agreed.","He roughly pushed the door open."]},
  { id:79, word:"thoroughly", pron:"/ˈθʌr.ə.li/", emoji:"🧹", cat:"Adverb", es:"a fondo / completamente",
    ex:["She thoroughly enjoyed the show.","Clean the surface thoroughly.","The plan was thoroughly reviewed."]},
  { id:80, word:"considerably", pron:"/kənˈsɪd.ər.ə.bli/", emoji:"📊", cat:"Adverb", es:"considerablemente",
    ex:["Prices have increased considerably.","She's considerably older than him.","The situation has improved considerably."]},
  { id:81, word:"apparently", pron:"/əˈpær.ənt.li/", emoji:"🗞️", cat:"Adverb", es:"aparentemente / al parecer",
    ex:["Apparently, they've moved to London.","She apparently forgot about the meeting.","The issue is apparently resolved."]},
  { id:82, word:"meanwhile", pron:"/ˈmiːn.waɪl/", emoji:"⏯️", cat:"Adverb", es:"mientras tanto",
    ex:["Meanwhile, the situation was getting worse.","She studied; meanwhile, he played games.","Meanwhile, back at the office..."]},
  { id:83, word:"nevertheless", pron:"/ˌnev.ər.ðəˈles/", emoji:"↪️", cat:"Adverb", es:"sin embargo / no obstante",
    ex:["It was risky; nevertheless, we proceeded.","She was tired, but nevertheless kept working.","Nevertheless, the results were promising."]},
  { id:84, word:"ultimately", pron:"/ˈʌl.tɪ.mət.li/", emoji:"🏁", cat:"Adverb", es:"en última instancia / finalmente",
    ex:["Ultimately, the decision is yours.","It ultimately led to success.","They ultimately agreed to the terms."]},
  { id:85, word:"solely", pron:"/ˈsoʊl.li/", emoji:"☝️", cat:"Adverb", es:"únicamente / exclusivamente",
    ex:["The blame lies solely with management.","I'm solely responsible for this.","Success depends solely on effort."]},

  // MISC B2 (15)
  { id:86, word:"cope", pron:"/koʊp/", emoji:"🧘", cat:"Verb", es:"lidiar / arreglárselas",
    ex:["She coped well with the pressure.","How do you cope with stress?","It's hard to cope with loss."]},
  { id:87, word:"praise", pron:"/preɪz/", emoji:"👏", cat:"Noun/Verb", es:"elogio / elogiar",
    ex:["The teacher praised his efforts.","She deserves praise for her work.","The film received widespread praise."]},
  { id:88, word:"adequate", pron:"/ˈæd.ɪ.kwət/", emoji:"✔️", cat:"Adjective", es:"adecuado / suficiente",
    ex:["The facilities are barely adequate.","We need adequate funding.","Is this an adequate response?"]},
  { id:89, word:"substantial", pron:"/səbˈstæn.ʃəl/", emoji:"🏔️", cat:"Adjective", es:"sustancial / considerable",
    ex:["They made a substantial investment.","There's a substantial difference.","She earns a substantial salary."]},
  { id:90, word:"abolish", pron:"/əˈbɒl.ɪʃ/", emoji:"🗑️", cat:"Verb", es:"abolir / eliminar",
    ex:["The law was abolished in 1990.","They want to abolish the death penalty.","Slavery was abolished long ago."]},
  { id:91, word:"ambiguous", pron:"/æmˈbɪɡ.ju.əs/", emoji:"❓", cat:"Adjective", es:"ambiguo",
    ex:["The statement was deliberately ambiguous.","The rules are somewhat ambiguous.","His answer was ambiguous."]},
  { id:92, word:"compensate", pron:"/ˈkɒm.pen.seɪt/", emoji:"💰", cat:"Verb", es:"compensar / indemnizar",
    ex:["The company compensated the victims.","Nothing can compensate for the loss.","He was fairly compensated."]},
  { id:93, word:"prospect", pron:"/ˈprɒs.pekt/", emoji:"🌅", cat:"Noun", es:"perspectiva / posibilidad",
    ex:["Job prospects are looking good.","The prospect of change excites me.","There's little prospect of improvement."]},
  { id:94, word:"contemplate", pron:"/ˈkɒn.tem.pleɪt/", emoji:"🤔", cat:"Verb", es:"contemplar / considerar",
    ex:["She contemplated her options carefully.","I've been contemplating a career change.","He sat contemplating the view."]},
  { id:95, word:"vulnerable", pron:"/ˈvʌl.nər.ə.bəl/", emoji:"🥀", cat:"Adjective", es:"vulnerable",
    ex:["Children are especially vulnerable.","The system is vulnerable to attacks.","She felt vulnerable after the breakup."]},
  { id:96, word:"initiative", pron:"/ɪˈnɪʃ.ə.tɪv/", emoji:"🚀", cat:"Noun", es:"iniciativa",
    ex:["She took the initiative to organize it.","The government launched a new initiative.","Show some initiative!"]},
  { id:97, word:"legitimate", pron:"/lɪˈdʒɪt.ɪ.mət/", emoji:"📜", cat:"Adjective", es:"legítimo",
    ex:["That's a legitimate concern.","Is this a legitimate business?","She has a legitimate claim."]},
  { id:98, word:"obstacle", pron:"/ˈɒb.stə.kəl/", emoji:"🧱", cat:"Noun", es:"obstáculo",
    ex:["Lack of funding is a major obstacle.","She overcame many obstacles.","Don't let obstacles stop you."]},
  { id:99, word:"stimulate", pron:"/ˈstɪm.jə.leɪt/", emoji:"⚡", cat:"Verb", es:"estimular",
    ex:["Exercise stimulates the brain.","We need to stimulate economic growth.","The discussion stimulated new ideas."]},
  { id:100, word:"precisely", pron:"/prɪˈsaɪs.li/", emoji:"🎯", cat:"Adverb", es:"precisamente / exactamente",
    ex:["That's precisely what I mean.","She arrived at precisely 3 PM.","Measure the ingredients precisely."]},

  // NEW WORDS (10)
  { id:101, word:"fall behind", pron:"/fɔːl bɪˈhaɪnd/", emoji:"🐢", cat:"Phrasal Verb", es:"quedarse atrás / retrasarse",
    ex:["Don't fall behind on your payments.","She fell behind in her studies after being ill.","Our team is falling behind schedule."]},
  { id:102, word:"stand out", pron:"/stænd aʊt/", emoji:"🌟", cat:"Phrasal Verb", es:"destacar / sobresalir",
    ex:["Her resume really stands out from the rest.","He stood out as the most talented player.","Bright colors make the design stand out."]},
  { id:103, word:"back up", pron:"/bæk ʌp/", emoji:"💾", cat:"Phrasal Verb", es:"respaldar / hacer copia de seguridad",
    ex:["Always back up your files regularly.","Can you back up your claim with evidence?","Traffic was backed up for miles."]},
  { id:104, word:"entail", pron:"/ɪnˈteɪl/", emoji:"📝", cat:"Verb", es:"implicar / conllevar",
    ex:["What does the job entail exactly?","The project entails a lot of research.","This decision entails certain risks."]},
  { id:105, word:"scarce", pron:"/skers/", emoji:"🏜️", cat:"Adjective", es:"escaso",
    ex:["Clean water is scarce in that region.","Resources became increasingly scarce.","Jobs are scarce in rural areas."]},
  { id:106, word:"trait", pron:"/treɪt/", emoji:"🧬", cat:"Noun", es:"rasgo / característica",
    ex:["Honesty is his best trait.","Leadership traits can be developed.","The trait is passed down genetically."]},
  { id:107, word:"exempt", pron:"/ɪɡˈzempt/", emoji:"🎫", cat:"Adjective", es:"exento / libre de",
    ex:["Students are exempt from the tax.","No one is exempt from the rules.","The organization is exempt from paying fees."]},
  { id:108, word:"pledge", pron:"/pledʒ/", emoji:"🤞", cat:"Noun/Verb", es:"promesa / comprometerse",
    ex:["He pledged to support the cause.","The company made a pledge to reduce emissions.","They pledged $1 million to charity."]},
  { id:109, word:"hinder", pron:"/ˈhɪn.dər/", emoji:"🚧", cat:"Verb", es:"obstaculizar / dificultar",
    ex:["Bad weather hindered rescue efforts.","Don't let fear hinder your progress.","Lack of funding hindered the project."]},
  { id:110, word:"supposedly", pron:"/səˈpoʊ.zɪd.li/", emoji:"🗣️", cat:"Adverb", es:"supuestamente",
    ex:["He supposedly left the country last week.","The restaurant is supposedly the best in town.","She was supposedly an expert in the field."]},
];

const CATEGORIES = ["All", "Phrasal Verb", "Adjective", "Verb", "Noun", "Adverb", "Noun/Verb"];

const CAT_COLORS = {
  "Phrasal Verb": { bg: "#4F46E5", light: "#EEF2FF" },
  "Adjective": { bg: "#0891B2", light: "#ECFEFF" },
  "Verb": { bg: "#059669", light: "#ECFDF5" },
  "Noun": { bg: "#D97706", light: "#FFFBEB" },
  "Adverb": { bg: "#DC2626", light: "#FEF2F2" },
  "Noun/Verb": { bg: "#7C3AED", light: "#F5F3FF" },
};

export default function FlashcardApp() {
  const [filter, setFilter] = useState("All");
  const [currentIdx, setCurrentIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(new Set());
  const [learning, setLearning] = useState(new Set());
  const [showList, setShowList] = useState(false);
  const [shuffled, setShuffled] = useState(false);
  const [displayWords, setDisplayWords] = useState(WORDS);
  const [reviewMode, setReviewMode] = useState(false);

  const filtered = displayWords.filter(w => {
    const catMatch = filter === "All" || w.cat === filter;
    if (reviewMode) return catMatch && learning.has(w.id);
    return catMatch;
  });
  const card = filtered[currentIdx] || filtered[0];

  useEffect(() => { setCurrentIdx(0); setFlipped(false); }, [filter, shuffled, reviewMode]);

  const shuffle = useCallback(() => {
    const arr = [...WORDS];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    setDisplayWords(arr);
    setShuffled(s => !s);
  }, []);

  const next = () => { setFlipped(false); setCurrentIdx(i => (i + 1) % filtered.length); };
  const prev = () => { setFlipped(false); setCurrentIdx(i => (i - 1 + filtered.length) % filtered.length); };

  const markKnown = () => {
    setKnown(s => { const n = new Set(s); n.add(card.id); return n; });
    setLearning(s => { const n = new Set(s); n.delete(card.id); return n; });
    next();
  };
  const markLearning = () => {
    setLearning(s => { const n = new Set(s); n.add(card.id); return n; });
    setKnown(s => { const n = new Set(s); n.delete(card.id); return n; });
    next();
  };

  const progress = Math.round((known.size / WORDS.length) * 100);

  const catColor = CAT_COLORS[card?.cat] || { bg: "#6B7280", light: "#F3F4F6" };

  if (showList) {
    return (
      <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", minHeight: "100vh", color: "#E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
            <h2 style={{ margin: 0, fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em" }}>📚 All 110 Words</h2>
            <button onClick={() => setShowList(false)} style={{ background: "#334155", border: "none", color: "#E2E8F0", padding: "10px 20px", borderRadius: 10, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Back to Cards</button>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{
                background: filter === c ? (CAT_COLORS[c]?.bg || "#6366F1") : "#1E293B",
                border: `1px solid ${filter === c ? "transparent" : "#334155"}`,
                color: "#E2E8F0", padding: "6px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600
              }}>{c} {c === "All" ? `(${WORDS.length})` : `(${WORDS.filter(w=>w.cat===c).length})`}</button>
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 12 }}>
            {filtered.map(w => {
              const cc = CAT_COLORS[w.cat] || { bg: "#6B7280" };
              const status = known.has(w.id) ? "✅" : learning.has(w.id) ? "🔄" : "";
              return (
                <div key={w.id} style={{ background: "#1E293B", borderRadius: 12, padding: "14px 16px", border: "1px solid #334155", display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 28 }}>{w.emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{w.word}</span>
                      <span style={{ background: cc.bg, color: "#fff", fontSize: 9, padding: "2px 7px", borderRadius: 10, fontWeight: 600 }}>{w.cat}</span>
                      {status && <span style={{ fontSize: 14 }}>{status}</span>}
                    </div>
                    <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>{w.pron} — {w.es}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "'Segoe UI', 'Helvetica Neue', sans-serif", background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", minHeight: "100vh", color: "#E2E8F0", display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 16px" }}>
      {/* Header */}
      <div style={{ width: "100%", maxWidth: 600, marginBottom: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 800, letterSpacing: "-0.03em", background: "linear-gradient(135deg, #818CF8, #38BDF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>B2 Flashcards</h1>
            <p style={{ margin: "4px 0 0", fontSize: 13, color: "#64748B" }}>110 palabras · Phrasal verbs · Pronunciación</p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={() => setReviewMode(r => !r)} title="Review learning cards" style={{ background: reviewMode ? "linear-gradient(135deg, #F59E0B, #D97706)" : "#334155", border: "none", color: "#E2E8F0", height: 38, padding: "0 12px", borderRadius: 10, cursor: "pointer", fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4, transition: "all 0.2s" }}>🔄 {reviewMode ? "Repasando" : "Repasar"}</button>
            <button onClick={shuffle} title="Shuffle" style={{ background: "#334155", border: "none", color: "#E2E8F0", width: 38, height: 38, borderRadius: 10, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>🔀</button>
            <button onClick={() => setShowList(true)} title="View all" style={{ background: "#334155", border: "none", color: "#E2E8F0", width: 38, height: 38, borderRadius: 10, cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>📋</button>
          </div>
        </div>

        {/* Progress */}
        <div style={{ marginTop: 14, background: "#1E293B", borderRadius: 12, padding: "12px 16px", border: "1px solid #334155" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#94A3B8", marginBottom: 6 }}>
            <span>✅ Conocidas: {known.size}</span>
            <span>🔄 Aprendiendo: {learning.size}</span>
            <span>📝 Pendientes: {WORDS.length - known.size - learning.size}</span>
          </div>
          <div style={{ background: "#0F172A", borderRadius: 99, height: 8, overflow: "hidden" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #4F46E5, #06B6D4)", width: `${progress}%`, transition: "width 0.5s ease" }} />
          </div>
          <div style={{ textAlign: "right", fontSize: 11, color: "#64748B", marginTop: 4 }}>{progress}% completado</div>
        </div>
      </div>

      {/* Category Filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 16, maxWidth: 600 }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            background: filter === c ? (CAT_COLORS[c]?.bg || "#6366F1") : "transparent",
            border: `1px solid ${filter === c ? "transparent" : "#334155"}`,
            color: filter === c ? "#fff" : "#94A3B8",
            padding: "5px 14px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontWeight: 600, transition: "all 0.2s"
          }}>{c}</button>
        ))}
      </div>

      {/* Review mode banner */}
      {reviewMode && (
        <div style={{ background: "linear-gradient(135deg, #F59E0B20, #D9770620)", border: "1px solid #F59E0B40", borderRadius: 12, padding: "10px 18px", marginBottom: 12, maxWidth: 600, width: "100%", textAlign: "center" }}>
          <span style={{ fontSize: 13, color: "#FCD34D", fontWeight: 600 }}>🔄 Modo Repaso — Solo tarjetas marcadas como "Aprendiendo" ({filtered.length})</span>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 ? (
        <div style={{ maxWidth: 520, width: "100%", minHeight: 300, background: "linear-gradient(145deg, #1E293B, #0F172A)", borderRadius: 24, border: "1px solid #334155", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 40 }}>
          <span style={{ fontSize: 56, marginBottom: 16 }}>{reviewMode ? "🎉" : "📭"}</span>
          <h3 style={{ margin: "0 0 8px", fontSize: 20, fontWeight: 700 }}>{reviewMode ? "¡No hay tarjetas para repasar!" : "No hay tarjetas"}</h3>
          <p style={{ margin: 0, fontSize: 14, color: "#64748B", textAlign: "center" }}>{reviewMode ? "Marca algunas tarjetas como 'Aprendiendo' y vuelve aquí para repasarlas." : "No se encontraron tarjetas con este filtro."}</p>
          {reviewMode && <button onClick={() => setReviewMode(false)} style={{ marginTop: 16, background: "#4F46E5", border: "none", color: "#fff", padding: "10px 24px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 600 }}>← Volver a todas</button>}
        </div>
      ) : (
      <>
      {/* Card Counter */}
      <div style={{ fontSize: 13, color: "#64748B", marginBottom: 10 }}>
        {currentIdx + 1} / {filtered.length}
      </div>

      {/* Flashcard */}
      {card && (
        <div
          onClick={() => setFlipped(f => !f)}
          style={{
            width: "100%", maxWidth: 520, minHeight: 360, cursor: "pointer", perspective: 1200, marginBottom: 16
          }}
        >
          <div style={{
            width: "100%", minHeight: 360, position: "relative",
            transformStyle: "preserve-3d", transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: flipped ? "rotateY(180deg)" : "rotateY(0)"
          }}>
            {/* Front */}
            <div style={{
              position: "absolute", width: "100%", minHeight: 360, backfaceVisibility: "hidden",
              background: "linear-gradient(145deg, #1E293B, #0F172A)",
              borderRadius: 24, border: `2px solid ${catColor.bg}40`,
              display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
              padding: 32, boxSizing: "border-box",
              boxShadow: `0 20px 60px ${catColor.bg}20, 0 0 0 1px ${catColor.bg}10`
            }}>
              <span style={{ background: catColor.bg, color: "#fff", fontSize: 10, padding: "3px 12px", borderRadius: 20, fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 20 }}>{card.cat}</span>
              <span style={{ fontSize: 72, marginBottom: 16, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))" }}>{card.emoji}</span>
              <h2 style={{ margin: "0 0 8px", fontSize: 32, fontWeight: 800, letterSpacing: "-0.02em", textAlign: "center" }}>{card.word}</h2>
              <p style={{ margin: 0, fontSize: 16, color: "#818CF8", fontStyle: "italic" }}>{card.pron}</p>
              <p style={{ margin: "16px 0 0", fontSize: 13, color: "#475569" }}>Toca para ver detalles →</p>
            </div>

            {/* Back */}
            <div style={{
              position: "absolute", width: "100%", minHeight: 360, backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
              background: "linear-gradient(145deg, #1E293B, #0F172A)",
              borderRadius: 24, border: `2px solid ${catColor.bg}40`,
              padding: 28, boxSizing: "border-box",
              boxShadow: `0 20px 60px ${catColor.bg}20`
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 28 }}>{card.emoji}</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>{card.word}</h3>
                    <span style={{ fontSize: 13, color: "#818CF8" }}>{card.pron}</span>
                  </div>
                </div>
                <span style={{ background: catColor.bg, color: "#fff", fontSize: 9, padding: "3px 10px", borderRadius: 12, fontWeight: 700 }}>{card.cat}</span>
              </div>

              <div style={{ background: `${catColor.bg}15`, borderRadius: 14, padding: "12px 16px", marginBottom: 16, borderLeft: `3px solid ${catColor.bg}` }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Traducción</div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "#E2E8F0" }}>{card.es}</div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Ejemplos</div>
                {card.ex.map((e, i) => (
                  <div key={i} style={{ display: "flex", gap: 8, marginBottom: 8, alignItems: "flex-start" }}>
                    <span style={{ color: catColor.bg, fontWeight: 800, fontSize: 13, marginTop: 1, flexShrink: 0 }}>{i + 1}.</span>
                    <p style={{ margin: 0, fontSize: 13, color: "#CBD5E1", lineHeight: 1.5 }}>{e}</p>
                  </div>
                ))}
              </div>

              <p style={{ margin: "12px 0 0", fontSize: 12, color: "#475569", textAlign: "center" }}>Toca para volver ←</p>
            </div>
          </div>
        </div>
      )}

      {/* Controls */}
      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
        <button onClick={prev} style={{ background: "#334155", border: "none", color: "#E2E8F0", width: 48, height: 48, borderRadius: 14, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>←</button>
        <button onClick={markLearning} style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", border: "none", color: "#fff", padding: "0 24px", height: 48, borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, transition: "transform 0.2s" }}>🔄 Aprendiendo</button>
        <button onClick={markKnown} style={{ background: "linear-gradient(135deg, #10B981, #059669)", border: "none", color: "#fff", padding: "0 24px", height: 48, borderRadius: 14, cursor: "pointer", fontSize: 14, fontWeight: 700, display: "flex", alignItems: "center", gap: 6, transition: "transform 0.2s" }}>✅ Conocida</button>
        <button onClick={next} style={{ background: "#334155", border: "none", color: "#E2E8F0", width: 48, height: 48, borderRadius: 14, cursor: "pointer", fontSize: 20, display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.2s" }}>→</button>
      </div>

      {/* Keyboard hint */}
      <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Haz clic en la tarjeta para voltearla</p>
      </>
      )}
    </div>
  );
}
