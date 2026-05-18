import { NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  host: process.env.DB_HOST || process.env.PGHOST || 'localhost',
  port: parseInt(process.env.DB_PORT || process.env.PGPORT || '5432'),
  database: process.env.DB_NAME || process.env.PGDATABASE || 'zadiac',
  user: process.env.DB_USER || process.env.PGUSER || 'postgres',
  password: process.env.DB_PASSWORD || process.env.PGPASSWORD || '1234',
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
})

export async function GET() {
  try {
    await pool.query('TRUNCATE TABLE designer_works CASCADE')
    await pool.query('TRUNCATE TABLE designers CASCADE')
    
    await pool.query('ALTER SEQUENCE designers_id_seq RESTART WITH 1')

    const designers = [
      {
        name: 'Коко Шанель',
        bio: 'Икона элегантности, освободившая женщин от корсетов. Габриэль Бонёр Шанель произвела революцию в мире моды, подарив женщинам удобную и элегантную одежду. Её знаменитое маленькое чёрное платье, твидовые костюмы и духи Chanel No.5 навсегда изменили представление о стиле.',
        image: '/images/designers/chanel.jpg',
        social: { instagram: 'https://instagram.com/chanelofficial' }
      },
      {
        name: 'Ив Сен-Лоран',
        bio: 'Революционер моды, создатель женского смокинга Le Smoking. Ив Анри Донатьё Матьё Сен-Лоран показал миру, что женщины могут быть одновременно элегантными, сильными и сексуальными.',
        image: '/images/designers/ysl.jpg',
        social: { instagram: 'https://instagram.com/ysl' }
      },
      {
        name: 'Александр Маккуин',
        bio: 'Тёмный гений британской моды, мастер драмы и театральности. Ли Александр Маккуин превращал показы в захватывающие шоу, а одежду — в произведения искусства.',
        image: '/images/designers/mcqueen.jpg',
        social: { instagram: 'https://instagram.com/alexandermcqueen' }
      },
      {
        name: 'Джорджо Армани',
        bio: 'Король сдержанной роскоши и безупречного кроя. Джорджо Армани создал эстетику расслабленной элегантности, сделав одежду невероятно комфортной.',
        image: '/images/designers/armani.jpg',
        social: { instagram: 'https://instagram.com/giorgioarmani' }
      },
      {
        name: 'Джанни Версаче',
        bio: 'Икона гламура, сексуальности и ярких принтов. Джанни Версаче создал империю роскоши, где сочетались античные мотивы, поп-культура и дерзкая сексуальность.',
        image: '/images/designers/versace.jpg',
        social: { instagram: 'https://instagram.com/versace' }
      },
      {
        name: 'Кристиан Диор',
        bio: 'Создатель стиля New Look, вернувший женственность в послевоенную моду. Кристиан Диор напомнил миру о роскоши и красоте после Второй мировой войны.',
        image: '/images/designers/dior.jpg',
        social: { instagram: 'https://instagram.com/dior' }
      }
    ]

    const designerIds = []

    for (const d of designers) {
      const result = await pool.query(
        `INSERT INTO designers (designer_name, bio, designer_image, social_links) 
         VALUES ($1, $2, $3, $4) 
         RETURNING id`,
        [d.name, d.bio, d.image, JSON.stringify(d.social)]
      )
      designerIds.push(result.rows[0].id)
    }

    const works = [
      // Коко Шанель
      { designer: 0, title: 'Маленькое чёрное платье', image: '/images/works/chanel_lbd.jpg', desc: 'Культовое платье — символ элегантности и хорошего вкуса' },
      { designer: 0, title: 'Твидовый костюм', image: '/images/works/chanel_tweed.jpg', desc: 'Классический костюм из твида — воплощение парижского шика' },
      { designer: 0, title: 'Сумка 2.55', image: '/images/works/chanel_bag.jpg', desc: 'Стёганая сумка на цепочке, созданная в феврале 1955 года' },
      // Ив Сен-Лоран
      { designer: 1, title: 'Le Smoking', image: '/images/works/ysl_smoking.jpg', desc: 'Революционный женский смокинг 1966 года' },
      { designer: 1, title: 'Платье Мондриана', image: '/images/works/ysl_mondrian.jpg', desc: 'Платье по мотивам картин Пита Мондриана' },
      // Александр Маккуин
      { designer: 2, title: 'Платье-бабочка', image: '/images/works/mcqueen_butterfly.jpg', desc: 'Платье с живыми бабочками — магия моды' },
      { designer: 2, title: 'Туфли Armadillo', image: '/images/works/mcqueen_shoes.jpg', desc: 'Знаменитые туфли-броненосцы высотой 30 см' },
      // Джорджо Армани
      { designer: 3, title: 'Мужской костюм', image: '/images/works/armani_suit.jpg', desc: 'Революционный костюм без жёсткой подкладки' },
      { designer: 3, title: 'Вечернее платье', image: '/images/works/armani_dress.jpg', desc: 'Изысканное платье Armani Privé' },
      // Джанни Версаче
      { designer: 4, title: 'Платье с булавками', image: '/images/works/versace_pins.jpg', desc: 'Легендарное платье Элизабет Хёрли' },
      { designer: 4, title: 'Шелковая рубашка', image: '/images/works/versace_shirt.jpg', desc: 'Яркая рубашка с барочным принтом Versace' },
      // Кристиан Диор
      { designer: 5, title: 'New Look', image: '/images/works/dior_newlook.jpg', desc: 'Революционное платье 1947 года' },
      { designer: 5, title: 'Платье Junon', image: '/images/works/dior_junon.jpg', desc: 'Вечернее платье, расшитое лепестками пиона' },
    ]

    let workCount = 0
    for (const w of works) {
      await pool.query(
        `INSERT INTO designer_works (designer_id, work_title, work_image, description) 
         VALUES ($1, $2, $3, $4)`,
        [designerIds[w.designer], w.title, w.image, w.desc]
      )
      workCount++
    }

    return NextResponse.json({
      success: true,
      designers_added: designerIds.length,
      works_added: workCount,
      message: 'Дизайнеры и работы успешно добавлены!'
    })
  } catch (error: any) {
    console.error('Seed error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}