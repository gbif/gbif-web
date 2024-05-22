import { Router } from "express";
import { z } from "zod";
import { validateRequest } from "zod-express-middleware";
import { confirmEndorsement } from "./confirm-endorsement";

const Schema = {
  body: z.object({
    key: z.string(),
    code: z.string(),
  })
}

export type ConfirmEndorsementDTO = z.infer<typeof Schema['body']>;

export function registerConfirmEndorsement(router: Router) {
  router.post('/confirm-endorsement', validateRequest(Schema), async (req, res) => {
    try {
      const result = await confirmEndorsement(req.body);
      res.status(200).json({ success: true, result });
    } catch (err) {
      res.status(500).json({ success: false });
    }
  });
}