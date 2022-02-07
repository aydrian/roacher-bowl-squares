import { db } from "./db.server";
import { shuffle, range } from "./helpers";

function advanceState(currentState) {
  switch (currentState) {
    case "INIT":
      return "Q1";
    case "Q1":
      return "Q2";
    case "Q2":
      return "Q3";
    case "Q3":
      return "Q4";
    case "Q4":
      return "FINAL";
    case "FINAL":
      return "FINAL";
  }
}

export async function getGame(gameId) {
  let game = await db.game.findUnique({
    where: { id: gameId },
    include: { claims: { include: { participant: true } } }
  });

  if (!game) {
    throw new Response("Not found.", {
      status: 404
    });
  }

  if (game.state !== "INIT") {
    const winningSquares = getWinningSquares(game.board, game.scores);
    game = { ...game, winningSquares };
  }

  return game;
}

export async function getParticipants(gameId) {
  const participants = await db.claim.findMany({
    select: { participant: true },
    where: { gameId },
    distinct: ["participantId"]
  });
  return participants;
}

export async function countClaims(gameId, participantId) {
  const numClaims = await db.claim.count({
    where: { AND: [{ gameId }, { participantId }] }
  });
  return numClaims;
}

export async function claimSquare(gameId, participantId, row, col) {
  row = BigInt(row);
  col = BigInt(col);
  try {
    const claim = await db.claim.create({
      data: { gameId, participantId, row, col }
    });
    return claim;
  } catch (err) {
    console.log(err);
  }
}

export async function releaseSquare(claimId) {
  await db.claim.delete({ where: { id: claimId } });
}

export async function startGame(gameId) {
  const game = await db.game.findUnique({
    select: { board: true },
    where: { id: gameId }
  });

  const rows = shuffle(range(10));
  const cols = shuffle(range(10));
  const board = { ...game.board, rows, cols };
  await db.game.update({
    data: {
      state: "Q1",
      board
    },
    where: { id: gameId }
  });
}

export async function lockScore(gameId, score1, score2) {
  const game = await db.game.findUnique({
    where: { id: gameId }
  });
  const { id, state } = game;
  const nextState = advanceState(state);
  const winningClaim = await getWinningClaim(game, score1, score2);
  let newScores = updateScores(game.scores, state, [score1, score2]);
  // Update next State scores with current
  newScores = updateScores(newScores, nextState, [score1, score2]);
  await db.game.update({
    data: {
      state: nextState,
      scores: newScores,
      winners: updateWinners(game.winners, state, winningClaim)
    },
    where: { id }
  });
}

export async function updateScore(gameId, score1, score2) {
  const game = await db.game.findUnique({
    where: { id: gameId }
  });
  const { id, state } = game;
  const winningClaim = await getWinningClaim(game, score1, score2);
  await db.game.update({
    data: {
      scores: updateScores(game.scores, state, [score1, score2]),
      winners: updateWinners(game.winners, state, winningClaim)
    },
    where: { id }
  });
}

function updateScores(scores, quarter, newScores) {
  let [q1Scores, q2Scores, q3Scores, q4Scores] = scores;
  switch (quarter) {
    case "Q1":
      q1Scores = newScores;
      break;
    case "Q2":
      q2Scores = newScores;
      break;
    case "Q3":
      q3Scores = newScores;
      break;
    case "Q4":
      q4Scores = newScores;
      break;
  }

  return [q1Scores, q2Scores, q3Scores, q4Scores].filter(
    (val) => val !== undefined
  );
}

function updateWinners(winners, quarter, winningClaim) {
  let [q1Winner, q2Winner, q3Winner, q4Winner] = winners;
  const winner = {
    id: winningClaim.participant.id,
    name: winningClaim.participant.username,
    userid: winningClaim.participant.userid
  };
  switch (quarter) {
    case "Q1":
      q1Winner = winner;
      break;
    case "Q2":
      q2Winner = winner;
      break;
    case "Q3":
      q3Winner = winner;
      break;
    case "Q4":
      q4Winner = winner;
      break;
  }
  console.log([q1Winner, q2Winner, q3Winner, q4Winner]);
  return [q1Winner, q2Winner, q3Winner, q4Winner].filter(
    (val) => val !== undefined
  );
}

async function getWinningClaim(game, score1, score2) {
  const { row, col } = getWinningSquare(game.board, score1, score2);
  const claim = await db.claim.findUnique({
    where: {
      gameId_row_col: {
        gameId: game.id,
        col: BigInt(col),
        row: BigInt(row)
      }
    },
    include: { participant: true }
  });
  return claim;
}

function getWinningSquare(gameBoard, score1, score2) {
  const { rows, cols } = gameBoard;
  const col = cols.findIndex((i) => i === score1 % 10);
  const row = rows.findIndex((i) => i === score2 % 10);
  return { row, col };
}

export function getWinningSquares(gameBoard, scores) {
  const squares = scores.map(([score1, score2]) =>
    getWinningSquare(gameBoard, score1, score2)
  );
  return squares;
}
