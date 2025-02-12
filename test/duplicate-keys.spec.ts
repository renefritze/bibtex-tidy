import { deepStrictEqual, strictEqual } from 'assert';
import { bibtex, bibtexTidy, test } from './utils';

const dupeKeys = bibtex`
%references
@preamble{{abc}}
@ARTICLE {feinberg1983technique,
  number={1},
  title={A technique for radiolabeling DNA restriction endonuclease fragments to high specific activity},
author="Feinberg, Andrew P and Vogelstein, Bert",
  journal    = {Analytical biochemistry},
  volume = 132,
  pages={6-13},
  year={1983},
  publisher={Elsevier},}
@article{miles1984qualitative,
    title={Qualitative data analysis: A sourcebook},
    author={Miles, Matthew B 
          and Huberman, A Michael and 
          Saldana, J},
    journal={Beverly Hills},
    year={1984} ,
    doi = {1.1}
    }
@inproceedings{Smith2009,
  author="Caroline JA Smith",
  year=2009,
  month=dec,
  title={{Quantum somethings}},
  journal={Journal of {B}lah}
}

% test duplicate (author and title)
@inproceedings{Smith2009a,
  author="Caroline JA Smith",
  year=2009,
  month=dec,
  title={{Quantum somethings}},
  journal={Journal of {B}lah},
  booktitle={blah}
}

@book{IP:1990,
author = "Prince, Ian",
year = {1990},
title = {Methods for Research}
}

% test duplicate (DOI)
@article{dupe1,
    title={Qualitative data analysis: A sourcebook},
    booktitle={things},
    doi = {1.1},
    }

% boo!
  @article{thing_a,
    title={blah},
    weird-key="{cheese} {"}in brie{"}"
  }
  % another comment
  @inproceedings{smith2009,
    author="Caroline JA Smith",
  year=2009,
  month=dec,
  title={{Quantum somethings}},journal={Journal of {B}lah}
}@conference_at{4,
  a__="{Caroline JA Smith}",
  _#bo={Q{Uantum} {s}omethings},
  key with spaces = thing,
}
% last thing
% another last thing`;

const noDupes = bibtex`
@ARTICLE {feinberg1983technique,
    number={1},
    title={A technique for radiolabeling DNA restriction endonuclease fragments to high specific activity},
  author="Feinberg, Andrew P and Vogelstein, Bert",
    journal    = {Analytical biochemistry},
    volume = 132,
    pages={6-13},
    year={1983},
    month={aug},
    publisher={Elsevier},}`;

test('duplicate key warnings', async () => {
	const tidied = await bibtexTidy(dupeKeys, { escape: true }, ['api']);
	const warnings = [
		{
			code: 'DUPLICATE_KEY',
			message: 'smith2009 is a duplicate entry key.',
		},
	];

	deepStrictEqual(tidied.api?.warnings, warnings);

	const tidied2 = await bibtexTidy(noDupes, { escape: false }, ['api']);
	strictEqual(tidied2.api?.warnings.length, 0);
});
