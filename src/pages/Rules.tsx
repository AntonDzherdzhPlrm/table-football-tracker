export function Rules() {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white/90 backdrop-blur rounded-lg shadow-md my-8">
      <h1 className="text-3xl font-bold mb-6 text-orange-600">
        Table Football Rules
      </h1>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Basic Rules</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>Matches are played 1-on-1 or 2-on-2 (team play).</li>
          <li>The first player or team to score 10 goals wins a set.</li>
          <li>
            A match consists of multiple sets, with the number of sets agreed
            upon by players before the match.
          </li>
          <li>
            For example, if players played 5 sets where one player won 3 sets
            and the other won 2, the final score would be 3-2.
          </li>
          <li>
            If the time limit is reached during a set, the player or team with
            the most goals wins that set.
          </li>
          <li>
            After a goal, the team that was scored against gets to serve the
            ball.
          </li>
          <li>
            If the ball goes out of play, the last team to touch it loses
            possession.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Fouls</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>
            <strong>Spinning:</strong> Rotating any rod more than 360° before or
            after striking the ball is prohibited.
          </li>
          <li>
            <strong>Dead ball:</strong> If the ball stops in an unreachable
            area, it is reintroduced at the nearest serving position.
          </li>
          <li>
            <strong>Jarring/Tilting:</strong> Lifting or moving the table to
            affect ball movement is not allowed.
          </li>
          <li>
            <strong>Reaching into the playing area:</strong> Players may not
            reach into the playing area while the ball is in play.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Serving</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>Before serving, ask if the opponent is ready.</li>
          <li>
            The ball must touch two player figures before being shot toward the
            goal.
          </li>
          <li>
            On serve, the ball must not go directly from the 5-rod to the goal.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Scoring System</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>Wins: 3 points</li>
          <li>Draws: 1 point</li>
          <li>Losses: 0 points</li>
        </ul>
        <p className="mt-3">
          Rankings are determined by total points, with ties broken by:
        </p>
        <ol className="list-decimal pl-5 mt-2 space-y-1">
          <li>Head-to-head results</li>
          <li>Goal difference</li>
          <li>Goals scored</li>
        </ol>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Match Structure</h2>
        <div className="space-y-4">
          <div>
            <h3 className="text-xl font-medium mb-2">English</h3>
            <p className="mb-2">
              A match consists of a series of sets. The number of sets is
              determined by players before the match begins.
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>Each set is played until one player/team scores 10 goals</li>
              <li>
                The winner of the match is the player/team who wins the majority
                of sets
              </li>
              <li>
                For example, in a 5-set match, if one player wins 3 sets and the
                other wins 2, the final score is recorded as 3-2
              </li>
            </ul>
          </div>

          <div className="pt-2 border-t border-gray-200">
            <h3 className="text-xl font-medium mb-2">Russian (Русский)</h3>
            <p className="mb-2">
              Игра состоит из сетов. Количество сетов определяется игроками
              перед началом матча.
            </p>
            <ul className="space-y-2 list-disc pl-5">
              <li>
                Каждый сет играется до 10 забитых голов одним игроком/командой
              </li>
              <li>
                Победителем матча становится игрок/команда, выигравшая
                большинство сетов
              </li>
              <li>
                Например, если игроки сыграли 5 сетов, в которых один игрок
                выиграл 3 сета, а другой - 2, итоговый счет будет 3-2
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Etiquette</h2>
        <ul className="space-y-3 list-disc pl-5">
          <li>Shake hands before and after each match.</li>
          <li>Do not distract your opponent during play.</li>
          <li>
            Wait for permission before removing the ball from the goal after
            scoring.
          </li>
          <li>
            After the match, leave the table in good condition for the next
            players.
          </li>
        </ul>
      </section>
    </div>
  );
}
